import React from 'react'

function GioiThieu() {
    return (
        <div>
            <div style={{ padding: '20px', textAlign: 'left', margin: '20px' }}>
                <h6>Giới thiệu</h6>
                <p><span style={{ fontWeight: 'bold' }}>Chuyển đổi giọng nói thành văn bản</span> là dịch vụ tự động chuyển đổi tiếng nói thành văn bản Tiếng Việt, đạt độ chính xác cao về ngữ pháp, chính tả, nhận dạng đa dạng giọng đọc vùng miền.</p>
                <p>Khách hàng đăng ký mới có thể nhận được <span style={{ fontWeight: 'bold' }}>60 phút sử dụng miễn phí</span> để trải nghiệm tính năng.</p>
                <p>Độ chính xác cao hơn 96% bằng việc tận dụng các thuật toán mạng nơ-ron học sâu tiên tiến nhất thế giới kết hợp với các giải pháp cho đặc thù Tiếng Việt. Tự huấn luyện bằng công nghệ học sâu (Deep learning) giúp chất lượng mỗi năm tốt hơn 20-30%, tốc độ nhanh gấp 3-4 lần.
                    Nhận kết quả nhận dạng giọng nói trong thời gian thực khi API xử lý đầu vào âm thanh được truyền trực tuyến từ micrô của ứng dụng hoặc được gửi từ tệp âm thanh được ghi âm trước.</p>
                <p>Có thể xử lý âm thanh nhiễu từ nhiều môi trường mà không yêu cầu thêm chức năng khử tiếng ồn.
                    Ngắt câu chính xác các phiên âm (ví dụ: dấu chấm, dấu phẩy, dấu chấm hỏi)</p>
                <h6>Ứng dụng</h6>
                <p>Dùng cho các ứng dụng điều khiển IoT, hay các phần mềm ra lệnh bằng giọng nói.</p>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h6>Đơn vị phát triển</h6>
                        <p style={{ color: 'rgba(0, 82, 204, 1)' }}>???</p>
                    </div>
                    <div>
                        <h6>Nhóm</h6>
                        <p style={{ color: 'rgba(0, 82, 204, 1)' }}>Xử lý ngôn ngữ tự nhiên</p>
                    </div>
                    <div>
                        <h6>Lần cập nhật gần nhất</h6>
                        <p>???</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GioiThieu