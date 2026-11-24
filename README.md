# React CRUD - Quản lý người dùng

Ứng dụng React 18 + Vite thực hiện các chức năng Create, Read, Update, Delete và Search theo tài liệu bài tập.

## Yêu cầu
- Node.js 18 trở lên
- npm

## Chạy trên máy
```bash
npm install
npm run dev
```
Mở địa chỉ Vite hiển thị trong terminal (thường là http://localhost:5173).

## Kiểm tra bản build
```bash
npm run build
npm run preview
```

## Triển khai lên Vercel
1. Đưa toàn bộ thư mục dự án lên một repository GitHub.
2. Đăng nhập Vercel và chọn **Add New → Project**.
3. Import repository vừa tạo.
4. Framework Preset: **Vite**; Build Command: `npm run build`; Output Directory: `dist`.
5. Chọn **Deploy**. Sau khi hoàn tất, sao chép URL trang web để nộp.

Có thể dùng Netlify: import repository, Build command `npm run build`, Publish directory `dist`.

## Lưu ý về dữ liệu
Ứng dụng tải danh sách ban đầu từ JSONPlaceholder. Các thao tác thêm/sửa/xóa được quản lý trong React state tại trình duyệt; chúng không ghi ngược lên máy chủ JSONPlaceholder nên dữ liệu sẽ trở về ban đầu khi tải lại trang.

## Cấu trúc
```text
src/
├── components/
│   ├── SearchForm.jsx
│   ├── AddUser.jsx
│   └── ResultTable.jsx
├── App.jsx
├── main.jsx
└── styles.css
```
