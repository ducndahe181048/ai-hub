import React from 'react'

function TaiLieuTichHopPhanMem() {
  return (
    <div>
        <div style={{ padding: '20px', textAlign: 'left', margin: '20px' }}>
            <h6>Chuyển đổi giọng nói thành văn bản</h6>
            
            <div>
                <h6>Mục đích</h6>
                <p>Chuyển đổi giọng nói thành văn bản Tiếng Việt</p>
            </div>

            <div>
                <h6>URL</h6>
                <input type="text" disabled={true} style={{ width: '100%', padding: '5px' }} value="https://api.com" />
            </div>

            <div>
                <h6>Method</h6>
                <input type="text" disabled={true} style={{ width: '100%', padding: '5px' }} value="POST" />
            </div>

            <div>
                <h6>Header</h6>
                <table style={{ width: '100%', border: '1px solid black' }}>
                    <tr style={{ textAlign: 'center', backgroundColor: 'rgb(0, 200, 255)', color: 'white' }}>
                        <th style={{ border: '1px solid black' }}>Key</th>
                        <th style={{ border: '1px solid black' }}>Value</th>
                        <th style={{ border: '1px solid black' }}>Description</th>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>Content-Type</td>
                        <td style={{ border: '1px solid black' }}>application/json</td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>accept</td>
                        <td style={{ border: '1px solid black' }}>*/*</td>
                    </tr>
                </table>
            </div>

            <div>
                <h6>Body</h6>
                <table style={{ width: '100%', border: '1px solid black' }}>
                    <tr style={{ textAlign: 'center', backgroundColor: 'rgb(0, 200, 255)', color: 'white' }}>
                        <th style={{ border: '1px solid black' }}>Key</th>
                        <th style={{ border: '1px solid black' }}>Value</th>
                        <th style={{ border: '1px solid black' }}>Description</th>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>file</td>
                        <td style={{ border: '1px solid black' }}>File</td>
                        <td style={{ border: '1px solid black' }}>File âm thanh</td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>token</td>
                        <td style={{ border: '1px solid black' }}>String</td>
                        <td style={{ border: '1px solid black' }}>Token của bạn</td>
                    </tr>
                </table>
            </div>

            <div>
                <h6>Response</h6>
                <table style={{ width: '100%', border: '1px solid black' }}>
                    <tr style={{ textAlign: 'center', backgroundColor: 'rgb(0, 200, 255)', color: 'white' }}>
                        <th style={{ border: '1px solid black' }}>#</th>
                        <th style={{ border: '1px solid black' }}>Key</th>
                        <th style={{ border: '1px solid black' }}>Value</th>
                        <th style={{ border: '1px solid black' }}>Description</th>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>1</td>
                        <td style={{ border: '1px solid black' }}>code</td>
                        <td style={{ border: '1px solid black' }}>Integer</td>
                        <td style={{ border: '1px solid black' }}>Mã lỗi trả về</td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>2</td>
                        <td style={{ border: '1px solid black' }}>message</td>
                        <td style={{ border: '1px solid black' }}>String</td>
                        <td style={{ border: '1px solid black' }}>Thông báo chi tiết</td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>3</td>
                        <td style={{ border: '1px solid black' }}>response</td>
                        <td style={{ border: '1px solid black' }}>Dictionary</td>
                        <td style={{ border: '1px solid black' }}>Kết quả API trả về nếu thành công</td>
                    </tr>
                </table>
            </div>

            <div>
                <h6>Bảng mã lỗi</h6>
                <table style={{ width: '100%', border: '1px solid black' }}>
                    <tr style={{ textAlign: 'center', backgroundColor: 'rgb(0, 200, 255)', color: 'white' }}>
                        <th style={{ border: '1px solid black' }}>#</th>
                        <th style={{ border: '1px solid black' }}>Response Code</th>
                        <th style={{ border: '1px solid black' }}>Description</th>    
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>1</td>
                        <td style={{ border: '1px solid black' }}>200</td>
                        <td style={{ border: '1px solid black' }}>Thành công</td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>2</td>
                        <td style={{ border: '1px solid black' }}>400</td>
                        <td style={{ border: '1px solid black' }}>Sai dữ liệu đầu vào</td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>3</td>
                        <td style={{ border: '1px solid black' }}>401</td>
                        <td style={{ border: '1px solid black' }}>Chưa xác thực được người dùng</td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>4</td>
                        <td style={{ border: '1px solid black' }}>403</td>
                        <td style={{ border: '1px solid black' }}>Server nhận được dữ liệu nhưng người dùng không có quyền truy cập</td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black' }}>5</td>
                        <td style={{ border: '1px solid black' }}>500</td>
                        <td style={{ border: '1px solid black' }}>Server xảy ra lỗi không lường trước</td>
                    </tr>
                </table>
            </div>

        </div>
    </div>
  )
}

export default TaiLieuTichHopPhanMem