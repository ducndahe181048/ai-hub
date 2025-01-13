import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import audio1 from '../assets/audio_test_1.wav';  // Sample Audio 1
import audio2 from '../assets/audio_test_2.wav';  // Sample Audio 2

function SuDungDichVu() {
    const [audioSrc, setAudioSrc] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [transcribedText, setTranscribedText] = useState('');

    const handleFileAudioChange = async (e, name) => {
        setFileName(name);
        setTranscribedText('Đang nhận dạng...');
        
        // For sample audio, fetch the audio content as a Blob
        if (typeof e === 'string') {  // If e is a string (e.g., URL)
            const response = await fetch(e);
            const blob = await response.blob();  // Convert it to Blob
            setAudioSrc(URL.createObjectURL(blob));  // Set the audio source
            transcribeAudio(blob);  // Send the Blob to the backend for transcription
        } else {  // For uploaded audio
            setAudioSrc(e);
            transcribeAudio(e);  // Send the uploaded Blob (file) to the backend
        }
    };    

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'audio/wav') {
            const src = URL.createObjectURL(file);
            setAudioSrc(src);
            setFileName(file.name);
            setTranscribedText('Đang nhận dạng...');
            // Transcribe the uploaded audio
            transcribeAudio(file);
        } else {
            alert('File không hợp lệ! Vui lòng chọn file có định dạng .wav.');
        }
    };

    const handleRecordAudio = () => {
        navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 16000,
            },
        })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                const audioChunks = [];
                recorder.addEventListener('dataavailable', event => {
                    audioChunks.push(event.data);
                });

                recorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioSrc(audioUrl);
                    setFileName('Nghe lại giọng nói của bạn');
                    setIsRecording(false);

                    // Send audio blob to backend for processing
                    transcribeAudio(audioBlob);
                });

                recorder.start();
                setIsRecording(true);
            })
            .catch(error => {
                alert('Hãy bật quyền truy cập microphone để có thể sử dụng tính năng này!', error);
            });
    };

    const handleStopRecord = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setMediaRecorder(null);
        }
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
                                        onClick={isRecording ? handleStopRecord : handleRecordAudio}
                                        style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }}
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
