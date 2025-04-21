# Hướng dẫn triển khai CheckScam Minecraft với GitHub Issues API

## Giới thiệu

Đây là phiên bản cải tiến của trang web CheckScam Minecraft, sử dụng GitHub Issues API để lưu trữ và quản lý báo cáo. Phiên bản này giải quyết các vấn đề sau:

1. **Vấn đề giao diện thống kê**: Cải thiện giao diện với kích thước và căn chỉnh nhất quán
2. **Vấn đề lưu trữ dữ liệu**: Sử dụng GitHub Issues để lưu trữ báo cáo công khai
3. **Vấn đề hệ thống bình chọn**: Triển khai hệ thống bình chọn sử dụng Reactions API với giới hạn mỗi IP chỉ được bình chọn một lần
4. **Vấn đề cập nhật thống kê**: Tự động cập nhật thống kê từ dữ liệu GitHub Issues

## Cấu trúc thư mục

```
checkscam-github-issues/
├── css/
│   └── improved-styles.css
├── js/
│   ├── github-issues-api.js
│   ├── ui-integration.js
│   └── main-app.js
└── index.html
```

## Hướng dẫn triển khai

### 1. Chuẩn bị GitHub Repository

1. Đảm bảo repository của bạn (https://github.com/SalyyS1/checkscammcvn.github.io) đã được thiết lập đúng cách
2. Tạo các nhãn (labels) sau trong repository:
   - `scam-report`: Nhãn cơ bản cho tất cả báo cáo
   - `pending`: Trạng thái chờ xác minh
   - `verified`: Trạng thái đã xác minh
   - `resolved`: Trạng thái đã giải quyết
   - `false-report`: Trạng thái báo cáo sai

### 2. Tạo GitHub Personal Access Token (Tùy chọn)

Để cho phép tạo báo cáo mà không yêu cầu người dùng đăng nhập, bạn cần tạo một GitHub Personal Access Token:

1. Truy cập https://github.com/settings/tokens
2. Nhấp vào "Generate new token" > "Generate new token (classic)"
3. Đặt tên cho token (ví dụ: "CheckScam Minecraft")
4. Chọn phạm vi (scopes): `repo` (để có quyền truy cập đầy đủ vào repository)
5. Nhấp vào "Generate token"
6. Sao chép token và lưu trữ an toàn

### 3. Cấu hình ứng dụng

Mở file `js/main-app.js` và cập nhật cấu hình:

```javascript
const GITHUB_CONFIG = {
  owner: 'SalyyS1',
  repo: 'checkscammcvn.github.io',
  // Thêm token của bạn ở đây (tùy chọn)
  token: 'YOUR_GITHUB_TOKEN'
};
```

**Lưu ý về bảo mật**: Trong môi trường sản xuất, không nên lưu trữ token trực tiếp trong mã nguồn. Thay vào đó, bạn nên sử dụng một proxy server để xử lý các yêu cầu API cần xác thực.

### 4. Tải lên GitHub Pages

1. Sao chép tất cả các file trong thư mục `checkscam-github-issues` vào repository GitHub của bạn
2. Đảm bảo cấu trúc thư mục được giữ nguyên
3. Commit và push các thay đổi lên branch chính (main hoặc master)
4. GitHub Pages sẽ tự động triển khai trang web của bạn

## Tính năng

### Báo cáo lừa đảo

- Người dùng có thể gửi báo cáo mà không cần đăng nhập GitHub
- Báo cáo được lưu trữ dưới dạng GitHub Issues
- Mỗi báo cáo bao gồm thông tin chi tiết về người bị tố cáo và bằng chứng

### Tìm kiếm báo cáo

- Tìm kiếm theo tên Minecraft, ID Discord, hoặc link Facebook
- Hiển thị kết quả với trạng thái và số lượng bình chọn

### Hệ thống bình chọn

- Người dùng có thể xác nhận hoặc phản đối báo cáo
- Mỗi IP chỉ được bình chọn một lần cho mỗi báo cáo
- Bình chọn được lưu trữ dưới dạng reactions trên GitHub Issues

### Thống kê

- Hiển thị tổng số báo cáo, số báo cáo đã xác minh, đã giải quyết, đang chờ xử lý
- Hiển thị tổng số lượt bình chọn
- Hiển thị top 3 người bị tố cáo nhiều nhất

## Quản trị viên

Với tư cách là quản trị viên repository, bạn có thể:

1. Thay đổi trạng thái báo cáo bằng cách thêm/xóa nhãn trên GitHub Issues
2. Xóa báo cáo sai bằng cách đóng Issues
3. Thêm bình luận để cung cấp thông tin bổ sung

## Khắc phục sự cố

Nếu bạn gặp vấn đề với trang web, hãy kiểm tra:

1. Console của trình duyệt (F12) để xem lỗi JavaScript
2. Đảm bảo GitHub Token có đủ quyền truy cập
3. Kiểm tra cấu hình CORS nếu bạn gặp lỗi khi gọi API

## Hỗ trợ

Nếu bạn cần hỗ trợ thêm, vui lòng tạo một Issue mới trong repository GitHub của bạn.
