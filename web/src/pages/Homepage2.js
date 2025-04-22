import React from 'react';
import SuDungDichVu from '../components/SuDungDichVu';
import { Container, Row, Col } from 'react-bootstrap';

function Homepage2() {
    return (
        <>
            <div style={{ padding: '20px', textAlign: 'center', margin: '0 auto', fontWeight: '700', fontSize: '2rem' }}>
                <p style={{ color: 'gray' }}>Chuyển đổi giọng nói thành văn bản</p>
            </div>

            <div className="tab-content">
                <SuDungDichVu />
            </div>
        </>
    );
};

export default Homepage2;