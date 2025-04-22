import os
import gc
import json
import logging
import torch
import librosa
import numpy as np
import torchaudio
import soundfile as sf
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pydub import AudioSegment
from pydub.silence import detect_nonsilent
from pyannote.audio import Pipeline
from pyannote.core import Annotation
from transformers import SpeechEncoderDecoderModel, AutoFeatureExtractor, AutoTokenizer, GenerationConfig
from pyngrok import ngrok, conf

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/speech-to-text": {"origins": ["http://localhost:3000", "https://yourdomain.com"]}})

# Ngrok setup
# NGROK_PATH = os.getenv("NGROK_PATH", "ngrok")
# NGROK_CONFIG = os.getenv("NGROK_CONFIG", "ngrok.yml")
# pyngrok_config = conf.PyngrokConfig(ngrok_path=NGROK_PATH, config_path=NGROK_CONFIG)
# public_url = ngrok.connect(5000)
# logger.info(f"Ngrok public URL: {public_url}")

# Model initialization
MODEL_PATH = 'nguyenvulebinh/wav2vec2-bartpho'
model = SpeechEncoderDecoderModel.from_pretrained(MODEL_PATH).eval()
feature_extractor = AutoFeatureExtractor.from_pretrained(MODEL_PATH)
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

HF_TOKEN = os.getenv("HF_TOKEN")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
diarization_pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", use_auth_token=HF_TOKEN).to(device)

# Global variables
speaker_transcript = ""
speech_segments = []
MIN_DURATION = 0.2
MIN_SEGMENT_LENGTH = 2048
ALLOWED_EXTENSIONS = {'.wav', '.mp3', '.flac'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

def normalize_audio(audio_tensor):
    """Normalize audio tensor to range [-1, 1]."""
    return audio_tensor / torch.max(torch.abs(audio_tensor))

def spectral_gating(audio_tensor, threshold=0.01):
    """Apply spectral gating to the audio tensor."""
    stft = librosa.stft(audio_tensor)
    magnitude, phase = np.abs(stft), np.angle(stft)
    magnitude[magnitude < threshold] = 0
    denoised_stft = magnitude * np.exp(1j * phase)
    return librosa.istft(denoised_stft)

def format_seconds_to_mm_ss(seconds):
    """Convert seconds to MM:SS format."""
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02}:{seconds:02}"

def convert_to_mono(audio_path):
    """Convert audio to mono if it is stereo."""
    audio_data, sample_rate = sf.read(audio_path)
    if audio_data.ndim == 2:
        audio_data = audio_data.mean(axis=1)
    return audio_data, sample_rate

def decode_tokens(token_ids, skip_special_tokens=True, time_precision=0.02):
    """Decode token IDs to text, handling timestamps."""
    timestamp_begin = tokenizer.vocab_size
    outputs = [[]]
    for token in token_ids:
        if token >= timestamp_begin:
            outputs.append([])
        else:
            outputs[-1].append(token)
    outputs = [
        s if isinstance(s, str) else tokenizer.decode(s, skip_special_tokens=skip_special_tokens) for s in outputs
    ]
    return "".join(outputs).replace("< |", "<|").replace("| >", "|>").replace("> <", ". ").replace("<", "").replace(">", "")

def decode_wav(audio_wavs, prefix=""):
    """Decode audio waveforms to text."""
    device = next(model.parameters()).device
    input_values = feature_extractor.pad(
        [{"input_values": feature} for feature in audio_wavs],
        padding=True,
        max_length=None,
        pad_to_multiple_of=None,
        return_tensors="pt",
    )

    output_beam_ids = model.generate(
        input_values['input_values'].to(device),
        attention_mask=input_values['attention_mask'].to(device),
        decoder_input_ids=tokenizer.batch_encode_plus([prefix] * len(audio_wavs), return_tensors="pt")['input_ids'][..., :-1].to(device),
        generation_config=GenerationConfig(decoder_start_token_id=tokenizer.bos_token_id),
        max_length=250,
        num_beams=55,
        no_repeat_ngram_size=4,
        num_return_sequences=1,
        early_stopping=True,
        length_penalty=0.8,
        return_dict_in_generate=True,
        output_scores=True,
    )

    return [decode_tokens(sequence) for sequence in output_beam_ids.sequences]

def filter_short_segments(annotation, min_duration=0.3):
    """Filter out short segments from diarization annotation."""
    filtered = Annotation()
    for segment, track, label in annotation.itertracks(yield_label=True):
        if segment.duration >= min_duration:
            filtered[segment, track] = label
    return filtered

def trim_silence(audio_file, silence_thresh=-45, min_silence_len=100, padding=80):
    """Trim silence from audio file."""
    audio = AudioSegment.from_file(audio_file)
    nonsilent_ranges = detect_nonsilent(audio, min_silence_len=min_silence_len, silence_thresh=silence_thresh)
    if nonsilent_ranges:
        start = max(0, nonsilent_ranges[0][0] - padding)
        end = min(len(audio), nonsilent_ranges[-1][1] + padding)
        return audio[start:end]
    return audio

def process_segment(audio_path, start, end, target_sr=16000):
    """Extract and resample a segment from an audio file."""
    with sf.SoundFile(audio_path) as f:
        f.seek(int(start * f.samplerate))
        samples = f.read(int((end - start) * f.samplerate))
        samples = librosa.to_mono(samples.T)
        return librosa.resample(samples, orig_sr=f.samplerate, target_sr=target_sr)

def diarize_audio(audio_path):
    """
    Diarize an audio file to identify speaker segments.
    
    Args:
        audio_path (str): Path to the input audio file.
    
    Returns:
        list: List of tuples (start_time, end_time, speaker_label).
    
    Raises:
        RuntimeError: If diarization fails.
    """
    try:
        trimmed_audio = trim_silence(audio_path)
        trimmed_audio.export(audio_path, format="wav")
        diarization = diarization_pipeline(audio_path, num_speakers=2)
        speaker_segments = []
        for segment, _, speaker in diarization.itertracks(yield_label=True):
            if segment.duration >= MIN_DURATION:
                speaker_segments.append((segment.start, segment.end, speaker))
                logger.info(f"Speaker {speaker} from {segment.start:.1f}s to {segment.end:.1f}s")
        return sorted(speaker_segments, key=lambda x: x[0])
    except Exception as e:
        logger.error(f"Diarization error: {str(e)}")
        raise RuntimeError(f"Error during diarization: {str(e)}")

def process_segments_in_memory(audio_path, speaker_segments, batch_size=10):
    """
    Process speaker segments in memory and transcribe them.
    
    Args:
        audio_path (str): Path to the input audio file.
        speaker_segments (list): List of (start, end, speaker) tuples.
        batch_size (int): Number of segments to process in a batch.
    """
    global speaker_transcript, speech_segments
    audio_data_batch = []
    batch_info = []

    for start, end, speaker in speaker_segments:
        segment_16k = process_segment(audio_path, start, end)
        if len(segment_16k) >= MIN_SEGMENT_LENGTH:
            audio_data_batch.append(segment_16k)
            batch_info.append((start, end, speaker))
        
        if len(audio_data_batch) >= batch_size or (start == speaker_segments[-1][0] and audio_data_batch):
            transcriptions = decode_wav(audio_data_batch)
            for (start, end, speaker), transcription in zip(batch_info, transcriptions):
                if transcription.strip():
                    speech_segments.append({
                        "start_time": start,
                        "end_time": end,
                        "speaker": speaker,
                        "text": transcription
                    })
                    speaker_transcript += f"({format_seconds_to_mm_ss(end - start)}): {transcription} "
            audio_data_batch = []
            batch_info = []
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()

def save_uploaded_file(file):
    """Save the uploaded file to a temporary path."""
    audio_path = "temp_audio.wav"
    file.save(audio_path)
    return audio_path

def clean_up(audio_path):
    """Remove temporary audio file."""
    if os.path.exists(audio_path):
        os.remove(audio_path)

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    """
    Handle speech-to-text conversion for uploaded audio files.
    
    Returns:
        JSON response with transcript and segments or error message.
    """
    global speaker_transcript, speech_segments
    speaker_transcript = ""
    speech_segments = []

    if 'file' not in request.files or request.files['file'].filename == '':
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if not os.path.splitext(file.filename)[1].lower() in ALLOWED_EXTENSIONS:
        return jsonify({'error': 'Invalid file format. Only WAV, MP3, or FLAC allowed.'}), 400

    if len(file.read()) > MAX_FILE_SIZE:
        return jsonify({'error': 'File size exceeds 100MB limit.'}), 400
    file.seek(0)

    try:
        audio_path = save_uploaded_file(file)
        speaker_segments = diarize_audio(audio_path)
        process_segments_in_memory(audio_path, speaker_segments)
        if not speech_segments:
            return jsonify({'error': 'No speech detected in the audio.'}), 400
        return jsonify({
            'transcript': speaker_transcript,
            'segments': speech_segments
        })
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        clean_up(audio_path)

if __name__ == "__main__":
    app.run(debug=True)