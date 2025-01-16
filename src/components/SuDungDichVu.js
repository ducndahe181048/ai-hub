import React, { useState, useRef } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import audio1 from '../assets/audio_test_1.wav';  // Sample Audio 1
import audio2 from '../assets/audio_test_2.wav';  // Sample Audio 2

function SuDungDichVu() {
    const [audioSrc, setAudioSrc] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [transcribedText, setTranscribedText] = useState('');
    const mediaStream = useRef(null);
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);

    const handleFileAudioChange = async (e, name) => {
        setFileName(name);
        setTranscribedText('Đang nhận dạng...');

        if (typeof e === 'string') {
            const response = await fetch(e);
            const blob = await response.blob();
            setAudioSrc(URL.createObjectURL(blob));
            transcribeAudio(blob);
        } else {
            setAudioSrc(e);
            transcribeAudio(e);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'audio/wav' && file.size <= 20 * 1024 * 1024) {
            const src = URL.createObjectURL(file);
            setAudioSrc(src);
            setFileName(file.name);
            setTranscribedText('Đang nhận dạng...');
            transcribeAudio(file);
        } else {
            alert('File không hợp lệ! Vui lòng chọn file có định dạng .wav <= 20mb.');
        }
    };

    const convertBlobToWav = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const wavBuffer = audioBufferToWav(audioBuffer);
        const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

        return wavBlob;
    };

    const audioBufferToWav = (buffer) => {
        const numOfChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const length = buffer.length * numOfChannels * 2 + 44;
        const wavBuffer = new ArrayBuffer(length);
        const view = new DataView(wavBuffer);

        let offset = 0;

        const writeString = (str) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
            offset += str.length;
        };

        const writeInt16 = (value) => {
            view.setInt16(offset, value, true);
            offset += 2;
        };

        // Write WAV header
        writeString('RIFF'); // ChunkID
        view.setUint32(offset, 36 + buffer.length * numOfChannels * 2, true); // ChunkSize
        offset += 4;
        writeString('WAVE'); // Format
        writeString('fmt '); // Subchunk1ID
        view.setUint32(offset, 16, true); // Subchunk1Size (PCM format)
        offset += 4;
        view.setUint16(offset, 1, true); // AudioFormat (1 = PCM)
        offset += 2;
        view.setUint16(offset, numOfChannels, true); // NumChannels
        offset += 2;
        view.setUint32(offset, sampleRate, true); // SampleRate
        offset += 4;
        view.setUint32(offset, sampleRate * numOfChannels * 2, true); // ByteRate
        offset += 4;
        view.setUint16(offset, numOfChannels * 2, true); // BlockAlign
        offset += 2;
        view.setUint16(offset, 16, true); // BitsPerSample
        offset += 2;
        writeString('data'); // Subchunk2ID
        view.setUint32(offset, buffer.length * numOfChannels * 2, true); // Subchunk2Size
        offset += 4;

        // Write interleaved PCM audio data
        const channels = [];
        for (let i = 0; i < numOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        for (let i = 0; i < buffer.length; i++) {
            for (let j = 0; j < numOfChannels; j++) {
                const sample = Math.max(-1, Math.min(1, channels[j][i])); // Clamp sample
                writeInt16(sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
            }
        }

        return wavBuffer;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStream.current = stream;
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const recordedBlob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' }); // Original recording
                const wavBlob = await convertBlobToWav(recordedBlob);
            
                const wavUrl = URL.createObjectURL(wavBlob);
                setAudioSrc(wavUrl); // Set .wav URL for playback
                setFileName('Ghi âm của bạn'); // Name of the converted file
            
                // Send the `wavBlob` for further processing
                transcribeAudio(wavBlob);
                chunks.current = [];
            };            

            mediaRecorder.current.start();
            setIsRecording(true);
            
        } catch (error) {
            alert('Hãy bật quyền truy cập microphone để có thể sử dụng tính năng này!');
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
        }
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach((track) => track.stop());
        }
        setIsRecording(false);
    };

    const transcribeAudio = async (audioBlob) => {
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio_input.wav');

            const response = await fetch('http://localhost:5000/speech-to-text', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setTranscribedText(data.transcript || 'Không thể nhận dạng văn bản.');
            } else {
                setTranscribedText('Lỗi trong quá trình xử lý.');
            }
        } catch (error) {
            console.error('Error transcribing audio:', error);
            setTranscribedText('Đã xảy ra lỗi khi nhận dạng âm thanh.');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'left', margin: '20px' }}>
            <Container>
                <Row>
                    <Col>
                        <Row>
                            <Col md={1}>
                                <h6>Bước 1</h6>
                            </Col>
                            <Col md={5}>
                                <h6>Tên dự án</h6>
                                <input type="text" style={{ width: '100%', padding: '5px' }} />
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '20px' }}>
                            <Col md={1}>
                                <h6>Bước 2</h6>
                            </Col>

                            <Col md={5}>
                                <h6>Chọn nguồn âm thanh - File (.wav) upload dung lượng không quá 20MB</h6>
                                <div style={{ padding: '10px' }}>
                                    <Button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        style={{ backgroundColor: isRecording ? 'red' : 'rgb(0, 200, 255)', border: 'none', margin: '10px' }}
                                        variant="primary"
                                    >
                                        {isRecording ? 'Dừng ghi âm' : 'Ghi âm giọng nói'}
                                    </Button>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        id="upload-wav"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="upload-wav">
                                        <Button
                                            as="span"
                                            style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }}
                                            variant="primary"
                                        >
                                            Tải file âm thanh
                                        </Button>
                                    </label>
                                    <Button
                                        onClick={() => handleFileAudioChange(audio1, 'audio_test_1.wav')}
                                        style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }}
                                        variant="primary"
                                    >
                                        File mẫu 1
                                    </Button>
                                    <Button
                                        onClick={() => handleFileAudioChange(audio2, 'audio_test_2.wav')}
                                        style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }}
                                        variant="primary"
                                    >
                                        File mẫu 2
                                    </Button>
                                </div>
                            </Col>

                            <Col md={6}>
                                <h6>Âm thanh ({fileName || 'Hãy chọn file âm thanh'})</h6>
                                <audio controls style={{ width: '100%' }} src={audioSrc} autoPlay={true}></audio>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '20px' }}>
                            <Col md={1}>
                                <h6>Bước 3</h6>
                            </Col>

                            <Col md={11}>
                                <h6>Nội dung văn bản được nhận dạng</h6>
                                <textarea
                                    value={transcribedText}
                                    disabled={true}
                                    rows={10}
                                    cols={50}
                                    style={{ width: '100%', padding: '10px' }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SuDungDichVu;
