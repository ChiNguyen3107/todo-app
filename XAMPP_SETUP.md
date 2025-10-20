# Hướng dẫn sử dụng MySQL với XAMPP

## Tại sao cần MySQL với XAMPP?

- **H2 Database** (mặc định) là in-memory database, dữ liệu sẽ mất khi restart server
- **MySQL với XAMPP** tạo database vĩnh viễn, dữ liệu được lưu trữ trên disk

## Cài đặt XAMPP

1. Tải XAMPP từ: https://www.apachefriends.org/
2. Cài đặt XAMPP (khuyến nghị: C:\xampp)
3. Khởi động XAMPP Control Panel

## Cấu hình Database

### 1. Khởi động MySQL trong XAMPP
- Mở XAMPP Control Panel
- Click "Start" cho Apache và MySQL
- Đảm bảo cả hai service đang chạy (màu xanh)

### 2. Tạo Database
```sql
-- Mở phpMyAdmin hoặc MySQL command line
CREATE DATABASE tododb;
```

### 3. Cấu hình ứng dụng
Ứng dụng đã được cấu hình để sử dụng MySQL:
- **Profile**: `mysql`
- **Database**: `tododb`
- **Host**: `localhost:3306`
- **Username**: `root`
- **Password**: (để trống)

## Chạy ứng dụng

### Cách 1: Sử dụng script tự động
```bash
# Chạy script tự động (khuyến nghị)
scripts\START_WITH_XAMPP.bat
```

### Cách 2: Chạy thủ công

1. **Khởi động XAMPP**
   - Mở XAMPP Control Panel
   - Start Apache và MySQL

2. **Chạy Backend**
   ```bash
   cd backend
   gradlew bootRun --args="--spring.profiles.active=mysql"
   ```

3. **Chạy Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## Dừng ứng dụng

```bash
# Dừng tất cả services
scripts\STOP_ALL.bat
```

## Kiểm tra Database

### Truy cập phpMyAdmin
1. Mở trình duyệt: http://localhost/phpmyadmin
2. Chọn database `tododb`
3. Xem các bảng đã được tạo tự động

### Truy cập MySQL Command Line
```bash
# Kết nối MySQL
mysql -u root

# Chọn database
USE tododb;

# Xem các bảng
SHOW TABLES;

# Xem dữ liệu users
SELECT * FROM users;
```

## Tài khoản mặc định

Sau khi chạy lần đầu, database sẽ có sẵn:

### Admin Account
- **Email**: admin@todo.local
- **Password**: Admin@123
- **Role**: ADMIN

### User Account  
- **Email**: user@todo.local
- **Password**: Admin@123
- **Role**: USER

## Troubleshooting

### Lỗi kết nối MySQL
```
Error: Could not connect to MySQL
```
**Giải pháp:**
1. Kiểm tra XAMPP đang chạy
2. Kiểm tra MySQL service trong XAMPP Control Panel
3. Thử restart MySQL service

### Lỗi database không tồn tại
```
Error: Unknown database 'tododb'
```
**Giải pháp:**
1. Tạo database thủ công:
   ```sql
   CREATE DATABASE tododb;
   ```
2. Hoặc sử dụng script tự động (đã tạo database)

### Lỗi quyền truy cập
```
Error: Access denied for user 'root'@'localhost'
```
**Giải pháp:**
1. Kiểm tra password MySQL (mặc định là trống)
2. Reset password MySQL trong XAMPP

## Lợi ích của MySQL với XAMPP

✅ **Dữ liệu vĩnh viễn** - Không mất khi restart server  
✅ **Quản lý dễ dàng** - Sử dụng phpMyAdmin  
✅ **Backup/Restore** - Export/Import database  
✅ **Performance** - Tốt hơn H2 cho production  
✅ **Scalability** - Dễ dàng mở rộng  

## Cấu trúc Database

Database `tododb` bao gồm các bảng:
- `users` - Thông tin người dùng
- `refresh_tokens` - JWT refresh tokens
- `categories` - Danh mục todos
- `tags` - Thẻ tags
- `todos` - Danh sách todos
- `todo_tags` - Liên kết todos và tags
- `attachments` - File đính kèm

Tất cả được tạo tự động bởi Flyway migration khi khởi động ứng dụng.
