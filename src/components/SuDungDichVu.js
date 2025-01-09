import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import audio1 from '../assets/audio.wav'
import audio2 from '../assets/FPTOpenSpeechData_Set001_V0.1_000001.wav'

function SuDungDichVu() {
    const [audioSrc, setAudioSrc] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const handleAudioChange = (src) => {
        setAudioSrc(src);
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'audio/wav') {
            const src = URL.createObjectURL(file);
            setAudioSrc(src);
        } else {
            alert('File không hợp lệ! Vui lòng chọn file có định dạng .wav.');
        }
    }

    const handleRecordAudio = () => {
        navigator.mediaDevices.getUserMedia({ 
            // audio: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 16000
            }
         })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                const audioChunks = [];
                mediaRecorder.addEventListener('dataavailable', event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioSrc(audioUrl);
                });

                setTimeout(() => {
                    mediaRecorder.stop();
                }, 5000); // Record for 5 seconds
            })
            .catch(error => {
                alert('Hãy bật quyền truy cập microphone để có thể sử dụng tính năng này!', error);
            });
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
                                    <Button onClick={() => handleRecordAudio()} style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }} variant="primary">
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
                                    <Button onClick={() => handleAudioChange(audio1)} style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }} variant="primary">File mẫu 1</Button>
                                    <Button onClick={() => handleAudioChange(audio2)} style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }} variant="primary">File mẫu 2</Button>
                                </div>
                            </Col>

                            <Col md={6}>
                                <h6>Âm thanh</h6>
                                <audio controls style={{ width: '100%' }} src={audioSrc} autoPlay={true}></audio>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '20px' }}>
                            <Col md={1}>
                                <h6>Bước 3</h6>
                            </Col>

                            <Col md={11}>
                                <h6>Nội dung văn bản được nhận dạng</h6>
                                <textarea disabled={true} rows={10} cols={50} style={{ width: '100%', padding: '10px' }} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SuDungDichVu