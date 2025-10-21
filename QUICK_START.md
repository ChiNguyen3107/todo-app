# 🚀 Todo App - Quick Start Guide

## Cách chạy ứng dụng (Đơn giản nhất)

### ✅ **Cách 1: Tự động (Khuyến nghị)**
```bash
# Chạy script tự động - tự phát hiện XAMPP
scripts\START_APP.bat
```

### ✅ **Cách 2: Thủ công**
1. **Nếu có XAMPP**: `scripts\START_WITH_XAMPP.bat`
2. **Nếu không có XAMPP**: `scripts\DEV_START.bat`

## 🎯 **Tính năng tự động**

Script `START_APP.bat` sẽ:
- ✅ Tự động phát hiện XAMPP có sẵn
- ✅ Sử dụng MySQL nếu có XAMPP (database vĩnh viễn)
- ✅ Fallback về H2 nếu không có XAMPP (in-memory)
- ✅ Kiểm tra ports và tự động chọn port khác nếu bị chiếm
- ✅ Tự động tạo database nếu cần
- ✅ Mở browser tự động

## 📊 **Tài khoản demo**

| Role | Email | Password | Mô tả |
|------|-------|----------|-------|
| **Admin** | admin@todo.local | Admin@123 | Quản lý toàn bộ hệ thống |
| **User** | user@todo.local | Admin@123 | Người dùng thông thường |

## 🌐 **URLs quan trọng**

| Service | URL | Mô tả |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Giao diện người dùng |
| **Backend API** | http://localhost:8081 | API REST |
| **Swagger UI** | http://localhost:8081/swagger-ui.html | Tài liệu API |
| **phpMyAdmin** | http://localhost/phpmyadmin | Quản lý database (nếu dùng XAMPP) |

## 🛑 **Dừng ứng dụng**

```bash
# Dừng tất cả services
scripts\STOP_ALL.bat
```

## 🔧 **Cấu hình Database**

### **Với XAMPP (Khuyến nghị)**
- ✅ Database vĩnh viễn
- ✅ Quản lý qua phpMyAdmin
- ✅ Backup/Restore dễ dàng
- ✅ Performance tốt

### **Với H2 (Fallback)**
- ⚠️ In-memory database
- ⚠️ Mất dữ liệu khi restart
- ✅ Không cần cài đặt gì thêm

## 📁 **Cấu trúc thư mục**

```
todo_app/
├── scripts/
│   ├── START_APP.bat          # Script chính (tự động)
│   ├── START_WITH_XAMPP.bat   # Script với XAMPP
│   ├── DEV_START.bat          # Script với H2
│   └── STOP_ALL.bat           # Dừng tất cả
├── backend/                   # Spring Boot API
├── frontend/                  # React Frontend
└── XAMPP_SETUP.md            # Hướng dẫn chi tiết XAMPP
```

## 🚨 **Troubleshooting**

### Lỗi Java không tìm thấy
```
[ERROR] Java not found!
```
**Giải pháp**: Cài đặt Java 17+ từ https://adoptium.net/

### Lỗi Node.js không tìm thấy
```
[ERROR] Node.js not found!
```
**Giải pháp**: Cài đặt Node.js 18+ từ https://nodejs.org/

### Lỗi port đã được sử dụng
```
[WARNING] Port 8081 is already in use
```
**Giải pháp**: Script tự động chọn port khác (8082, 8083...)

### Lỗi kết nối MySQL
```
[WARNING] Cannot connect to MySQL
```
**Giải pháp**: 
1. Kiểm tra XAMPP đang chạy
2. Hoặc script sẽ tự động chuyển sang H2

## 🎉 **Bắt đầu ngay**

1. **Clone repository** (nếu chưa có)
2. **Chạy script**: `scripts\START_APP.bat`
3. **Mở browser**: http://localhost:3000
4. **Đăng nhập**: admin@todo.local / Admin@123

**That's it!** 🚀

