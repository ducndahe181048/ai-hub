import React from 'react';
import '../css/TaiLieuTichHopPhanMem.css';

function TaiLieuTichHopPhanMem() {
  return (
    <div className="tai-lieu">
        <div className="content">
            <h6>Chuyển đổi giọng nói thành văn bản</h6>
            
            <div>
                <h6>Mục đích</h6>
                <p>Chuyển đổi giọng nói thành văn bản Tiếng Việt</p>
            </div>

            <div>
                <h6>URL</h6>
                <input type="text" disabled={true} className="input-field" value="https://api.com" />
            </div>

            <div>
                <h6>Method</h6>
                <input type="text" disabled={true} className="input-field" value="POST" />
            </div>

            <div>
                <h6>Header</h6>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Content-Type</td>
                            <td>application/json</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>accept</td>
                            <td>*/*</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h6>Body</h6>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>file</td>
                            <td>File</td>
                            <td>File âm thanh</td>
                        </tr>
                        <tr>
                            <td>token</td>
                            <td>String</td>
                            <td>Token của bạn</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h6>Response</h6>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>code</td>
                            <td>Integer</td>
                            <td>Mã lỗi trả về</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>message</td>
                            <td>String</td>
                            <td>Thông báo chi tiết</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>response</td>
                            <td>Dictionary</td>
                            <td>Kết quả API trả về nếu thành công</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h6>Bảng mã lỗi</h6>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Response Code</th>
                            <th>Description</th>    
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>200</td>
                            <td>Thành công</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>400</td>
                            <td>Sai dữ liệu đầu vào</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>401</td>
                            <td>Chưa xác thực được người dùng</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>403</td>
                            <td>Server nhận được dữ liệu nhưng người dùng không có quyền truy cập</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>500</td>
                            <td>Server xảy ra lỗi không lường trước</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default TaiLieuTichHopPhanMem;