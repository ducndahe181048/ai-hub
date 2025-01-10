import React, { useState } from 'react';
import GioiThieu from '../components/GioiThieu';
import SuDungDichVu from '../components/SuDungDichVu';
import TaiLieuTichHopPhanMem from '../components/TaiLieuTichHopPhanMem';
import { Container, Row, Col } from 'react-bootstrap';
import speechToTextImage from '../assets/speech_to_text_image.png';
import Sidebar from '../components/Sidebar';

function Homepage2() {
    const [activeTab, setActiveTab] = useState('gioi-thieu');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Container>
            <Row>
                <Col md={1}>
                    <Sidebar />
                </Col>

                <Col md={11}>
                    <div>
                        <div style={{ padding: '20px', textAlign: 'left', margin: '20px' }}>
                            <Container>
                                <Row>
                                    <Col md={1}>
                                        <img src={speechToTextImage} alt='speech to text' />
                                    </Col>

                                    <Col md={11}>
                                        <h6>Chuyển đổi giọng nói thành văn bản</h6>
                                        <p style={{ color: 'gray' }}>Dịch vụ Chuyển đổi giọng nói thành văn bản</p>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                        {/* Tabs */}
                        <div className="tabs" style={{ display: 'flex', justifyContent: 'start', padding: '20px', marginBottom: '20px' }}>
                            <div style={{ borderBottom: '1px solid rgb(0, 200, 255)', width: '100%', textAlign: 'left' }}>
                                <button
                                    // className={`tab ${activeTab === 'gioi-thieu' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('gioi-thieu')}
                                    // style={{ backgroundColor: 'rgb(0, 200, 255)', color:'white', border: 'none' }}
                                    style={{ backgroundColor: activeTab === 'gioi-thieu' ? 'rgb(0, 200, 255)' : 'white', color: activeTab === 'gioi-thieu' ? 'white' : 'black', border: 'none', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
                                >
                                    Giới thiệu
                                </button>

                                <button
                                    // className={`tab ${activeTab === 'dich-vu' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('dich-vu')}
                                    // style={{ backgroundColor: 'rgb(0, 200, 255)', color:'white', border: 'none' }}
                                    style={{ backgroundColor: activeTab === 'dich-vu' ? 'rgb(0, 200, 255)' : 'white', color: activeTab === 'dich-vu' ? 'white' : 'black', border: 'none', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}                >
                                    Sử dụng dịch vụ
                                </button>

                                <button
                                    // className={`tab ${activeTab === 'tai-lieu' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('tai-lieu')}
                                    // style={{ backgroundColor: 'rgb(0, 200, 255)', color:'white', border: 'none' }}
                                    style={{ backgroundColor: activeTab === 'tai-lieu' ? 'rgb(0, 200, 255)' : 'white', color: activeTab === 'tai-lieu' ? 'white' : 'black', border: 'none', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
                                >
                                    Tài liệu tích hợp phần mềm
                                </button>
                            </div>
                        </div>

                        {/* Nội dung hiển thị dựa trên tab được chọn */}
                        <div className="tab-content">

                            {activeTab === 'gioi-thieu' && (
                                <GioiThieu />
                            )}

                            {activeTab === 'dich-vu' && (
                                <SuDungDichVu />
                            )}

                            {activeTab === 'tai-lieu' && (
                                <TaiLieuTichHopPhanMem />
                            )}

                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Homepage2;