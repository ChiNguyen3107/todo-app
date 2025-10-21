# Hướng dẫn Import Database vào XAMPP

## Bước 1: Khởi động XAMPP
1. Mở XAMPP Control Panel
2. Start **Apache** và **MySQL**
3. Đảm bảo cả hai service đang chạy (màu xanh)

## Bước 2: Import Database
1. Mở trình duyệt và truy cập: `http://localhost/phpmyadmin`
2. Click **Import** ở menu trên
3. Click **Choose File** và chọn file: `database/tododb.sql`
4. Click **Go** để import

## Bước 3: Kiểm tra Database
1. Trong phpMyAdmin, chọn database **tododb** ở sidebar trái
2. Kiểm tra các bảng đã được tạo:
   - users
   - refresh_tokens
   - categories
   - tags
   - todos
   - todo_tags
   - attachments

## Bước 4: Chạy Ứng dụng
1. Chạy script: `scripts\START_APP.bat`
2. Ứng dụng sẽ tự động phát hiện MySQL và sử dụng database **tododb**

## Tài khoản Demo
- **Admin**: admin@todo.local / Admin@123
- **User**: user@todo.local / Admin@123

## Lưu ý
- Database sẽ được lưu vĩnh viễn trong XAMPP
- Dữ liệu sẽ không bị mất khi restart server
- Nếu cần reset database, chỉ cần import lại file SQL

