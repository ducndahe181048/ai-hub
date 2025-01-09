import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import audio1 from '../assets/audio.wav'
import audio2 from '../assets/FPTOpenSpeechData_Set001_V0.1_000001.wav'

function SuDungDichVu() {
    const [audioSrc, setAudioSrc] = useState('');

    const handleAudioChange = (src) => {
        setAudioSrc(src);
    }
    
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
                                    <Button style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }} variant="primary">Ghi âm giọng nói</Button>
                                    <Button style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }} variant="primary">Tải file âm thanh</Button>
                                    <Button onClick={() => handleAudioChange(audio1)} style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }} variant="primary">File mẫu 1</Button>
                                    <Button onClick={() => handleAudioChange(audio2)} style={{ backgroundColor: 'rgb(0, 200, 255)', border: 'none', margin: '10px' }} variant="primary">File mẫu 2</Button>
                                </div>
                            </Col>

                            <Col md={6}>
                                <h6>Âm thanh</h6>
                                <audio controls style={{ width: '100%' }} src={audioSrc}></audio>
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