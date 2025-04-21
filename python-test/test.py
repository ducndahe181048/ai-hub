from dotenv import load_dotenv
load_dotenv()
from pyannote.audio import Pipeline
from pyannote.core import Segment, Annotation
import librosa
import soundfile as sf
from transformers import SpeechEncoderDecoderModel
from transformers import AutoFeatureExtractor, AutoTokenizer, GenerationConfig
import torchaudio
import torch
import os
import numpy as np
import soundfile as sf
import argparse
import json
import requests
import gc
from pydub import AudioSegment

from pydub.silence import detect_nonsilent, split_on_silence
from scipy import signal
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok, conf

app = Flask(__name__)
CORS(app, resources={r"/speech-to-text": {"origins": "*"}})

# Ngrok setup
pyngrok_config = conf.PyngrokConfig(ngrok_path="C:/ngrok/ngrok.exe", config_path="C:/ngrok/ngrok.yml")
public_url = ngrok.connect(5000, pyngrok_config=pyngrok_config)
print(f"Ngrok public URL: {public_url}")  

model_path = 'nguyenvulebinh/wav2vec2-bartpho'
model = SpeechEncoderDecoderModel.from_pretrained(model_path).eval()
feature_extractor = AutoFeatureExtractor.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

HF_TOKEN = os.getenv("HF_TOKEN")

diarization_pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token=HF_TOKEN
)
diarization_pipeline.to(torch.device("cuda"))
def normalize_audio(audio_tensor):
    """Normalize audio tensor to range [-1, 1]."""
    return audio_tensor / torch.max(torch.abs(audio_tensor))

def spectral_gating(audio_tensor, threshold=0.01):
    """Apply spectral gating to the audio tensor."""
    stft = librosa.stft(audio_tensor)
    magnitude, phase = np.abs(stft), np.angle(stft)
    
    # Apply the threshold for spectral gating
    magnitude[magnitude < threshold] = 0
    
    # Reconstruct the STFT with the modified magnitude
    denoised_stft = magnitude * np.exp(1j * phase)
    
    # Inverse STFT to get back to time domain
    denoised_audio = librosa.istft(denoised_stft)
    return denoised_audio

def format_seconds_to_mm_ss(seconds):
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02}:{seconds:02}"

def convert_to_mono(audio_path):
    # Read the audio file
    audio_data, sample_rate = sf.read(audio_path)

    # Check if the audio is stereo
    if audio_data.ndim == 2:  # Stereo audio has 2 dimensions
        # Convert to mono by averaging the channels
        audio_data = audio_data.mean(axis=1)  # Average the channels

    return audio_data, sample_rate

# Decode token function
def decode_tokens(token_ids, skip_special_tokens=True, time_precision=0.02):
    timestamp_begin = tokenizer.vocab_size
    outputs = [[]]
    for token in token_ids:
        if token >= timestamp_begin:
            #timestamp = f" |{(token - timestamp_begin) * time_precision:.2f}| "
            #outputs.append(timestamp)
            outputs.append([])
        else:
            outputs[-1].append(token)
    outputs = [
        s if isinstance(s, str) else tokenizer.decode(s, skip_special_tokens=skip_special_tokens) for s in outputs
    ]
    return "".join(outputs).replace("< |", "<|").replace("| >", "|>").replace("> <", ". ").replace("<", "").replace(">", "")


# Decode wav function
def decode_wav(audio_wavs, prefix=""):
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

    output_text = [decode_tokens(sequence) for sequence in output_beam_ids.sequences]
    return output_text

def filter_short_segments(annotation, min_duration=0.3):
    filtered = Annotation()
    for segment, track, label in annotation.itertracks(yield_label=True):
        if segment.duration >= min_duration:
            filtered[segment, track] = label
    return filtered

def trim_silence(audio_file, silence_thresh=-45, min_silence_len=100, padding=80):
    # Load the audio file
    audio = AudioSegment.from_file(audio_file)
    
    # Detect non-silent parts
    nonsilent_ranges = detect_nonsilent(audio, min_silence_len=min_silence_len, silence_thresh=silence_thresh)
    
    # Trim the audio to the detected non-silent parts
    if nonsilent_ranges:
        start = max(0, nonsilent_ranges[0][0] - padding)
        end = min(len(audio), nonsilent_ranges[-1][1] + padding)
        trimmed_audio = audio[start:end]
        return trimmed_audio
    else:
        return audio  # If no speech is detected, return the original

# Initialize transcript
speaker_transcript = ""
speech_segments = []
min_duration = 0.2
def diarize_audio(audio_path):
    """Diarize the audio and return speaker segments."""
    trimmed_audio = trim_silence(audio_path)
    trimmed_audio.export(audio_path, format="wav")
    diarization = diarization_pipeline(audio_path, num_speakers=2)
    speaker_segments = []

    # Collect speaker segments with start/end times and speaker labels
    for segment, _, speaker in diarization.itertracks(yield_label=True):
        duration = segment.end - segment.start
        if duration >= min_duration:
            speaker_segments.append((segment.start, segment.end, speaker))
            print(f"Speaker {speaker} from {segment.start:.1f}s to {segment.end:.1f}s")
    # Sort by start time to ensure proper processing
    # Merge consecutive segments until the speaker changes
    '''
    merged_segments = []
    current_speaker = None
    current_start = None
    current_end = None

    for start, end, speaker in speaker_segments:
        if speaker == current_speaker:
            # Extend the current segment
            current_end = end
        else:
            # Save the previous segment and start a new one
            if current_speaker is not None:
                merged_segments.append((current_start, current_end, current_speaker))
            current_speaker = speaker
            current_start = start
            current_end = end

    # Add the last segment
    if current_speaker is not None:
        merged_segments.append((current_start, current_end, current_speaker))

    # Print the merged results
    for start, end, speaker in merged_segments:
        print(f"Merged: Speaker {speaker} from {start:.1f}s to {end:.1f}s")
    '''    
        
    return speaker_segments

# Step 2: Process in-memory segments for ASR without saving files
def process_segments_in_memory(audio_path, speaker_segments):
    global speaker_transcript, speech_segments
    """Process each speaker segment directly from the audio without saving to file."""
    # Load the entire audio file once
    audio, sr = librosa.load(audio_path, sr=None)
    audio_mono = librosa.to_mono(audio)
    min_segment_length = 2048
    for start, end, speaker in speaker_segments:
        # Convert start and end times to sample indices
        start_sample = int(start * sr)
        end_sample = int(end * sr)

        # Extract the segment corresponding to the current speaker
        segment = audio_mono[start_sample:end_sample]

        # Resample to 16kHz (Wav2Vec2 expects 16kHz audio)
        segment_16k = librosa.resample(segment, orig_sr=sr, target_sr=16000)
        #segment_16k = spectral_gating(segment_16k)
        if len(segment_16k) < min_segment_length:
            continue
        if len(segment_16k) > 0:
            audio_data = [segment_16k]  # Wrap the chunk in a list
            # Process the current chunk
            transcript_chunk = decode_wav(audio_data)
            transcription = " ".join(transcript_chunk) + " "
            if len(transcription.strip()) > 0:
                speech_segments.append({
                    "start_time": start,
                    "end_time": end,
                    "speaker": speaker,
                    "text": transcription
                })
                speaker_transcript += f"({format_seconds_to_mm_ss(end - start)}): {transcription}"
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    global speaker_transcript, speech_segments
    
    # Reset the global variables at the start of each request
    speaker_transcript = ""
    speech_segments = []
    
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files.get('file')
    if file.filename == '':
        return "No selected file", 400

    try:
        # Save the uploaded file temporarily
        audio_path = "temp_audio.wav"
        file.save(audio_path)
        
        # Perform diarization to get speaker segments
        speaker_segments = diarize_audio(audio_path)
        
        # Process each segment in-memory and transcribe it
        process_segments_in_memory(audio_path, speaker_segments)
        
        # Return the transcription as a JSON response
        return jsonify({'transcript': speaker_transcript})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(audio_path):
            os.remove(audio_path)
    

if __name__ == "__main__":
    app.run(debug=True)