-- ========================================
-- CƠ SỞ DỮ LIỆU TODO APP - FILE IMPORT XAMPP
-- Phiên bản tiếng Việt
-- ========================================
-- Database: tododb
-- ========================================

CREATE DATABASE IF NOT EXISTS tododb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tododb;

-- ========================================
-- 1. BẢNG NGƯỜI DÙNG
-- ========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP,
    updated_by BIGINT
);

-- ========================================
-- 2. BẢNG TOKEN LÀM MỚI
-- ========================================
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- 3. BẢNG DANH MỤC
-- ========================================
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    order_index INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP,
    updated_by BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_name UNIQUE (user_id, name)
);

-- ========================================
-- 4. BẢNG THẺ TAG
-- ========================================
CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP,
    updated_by BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_tag_user_name UNIQUE (user_id, name)
);

-- ========================================
-- 5. BẢNG CÔNG VIỆC (TODO)
-- ========================================
CREATE TABLE todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    due_date TIMESTAMP,
    remind_at TIMESTAMP,
    estimated_minutes INTEGER,
    parent_id BIGINT,
    category_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP,
    updated_by BIGINT,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ========================================
-- 6. BẢNG LIÊN KẾT TODO - TAG
-- ========================================
CREATE TABLE todo_tags (
    todo_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (todo_id, tag_id),
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ========================================
-- 7. BẢNG TỆP ĐÍNH KÈM
-- ========================================
CREATE TABLE attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    todo_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP,
    updated_by BIGINT,
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
);

-- ========================================
-- 8. DỮ LIỆU MẪU
-- ========================================

-- Tài khoản quản trị & người dùng mẫu
INSERT INTO users (email, password, full_name, role, email_verified, status, created_at, updated_at)
VALUES 
    ('admin@todo.local', '$2a$10$XQ5qYqCGH4VvHKqXqJZGe.rZ9YlQdGZ8C8mJ7jJ0xJ4yJ0J0J0J0J', 'Quản trị viên', 'ADMIN', TRUE, 'ACTIVE', NOW(), NOW()),
    ('nguoidung@todo.local', '$2a$10$XQ5qYqCGH4VvHKqXqJZGe.rZ9YlQdGZ8C8mJ7jJ0xJ4yJ0J0J0J', 'Người dùng Demo', 'USER', TRUE, 'ACTIVE', NOW(), NOW());

-- Danh mục công việc cho người dùng demo
INSERT INTO categories (user_id, name, color, order_index, created_at, updated_at)
VALUES 
    (2, 'Công việc', '#3B82F6', 1, NOW(), NOW()),
    (2, 'Cá nhân', '#10B981', 2, NOW(), NOW()),
    (2, 'Mua sắm', '#F59E0B', 3, NOW(), NOW()),
    (2, 'Sức khỏe', '#8B5CF6', 4, NOW(), NOW()),
    (2, 'Gia đình', '#F43F5E', 5, NOW(), NOW());

-- Thẻ tag
INSERT INTO tags (user_id, name, color, created_at, updated_at)
VALUES 
    (2, 'Khẩn cấp', '#EF4444', NOW(), NOW()),
    (2, 'Quan trọng', '#F59E0B', NOW(), NOW()),
    (2, 'Họp', '#06B6D4', NOW(), NOW()),
    (2, 'Ghi chú', '#8B5CF6', NOW(), NOW()),
    (2, 'Theo dõi', '#22C55E', NOW(), NOW());

-- Công việc mẫu
INSERT INTO todos (user_id, title, description, status, priority, due_date, category_id, created_at, updated_at)
VALUES 
    (2, 'Hoàn thiện tài liệu dự án', 'Viết tài liệu hướng dẫn sử dụng và API cho ứng dụng Todo', 'IN_PROGRESS', 'HIGH', DATE_ADD(NOW(), INTERVAL 3 DAY), 1, NOW(), NOW()),
    (2, 'Họp nhóm sáng thứ 2', 'Chuẩn bị nội dung thảo luận và báo cáo tiến độ tuần', 'PENDING', 'MEDIUM', DATE_ADD(NOW(), INTERVAL 1 DAY), 1, NOW(), NOW()),
    (2, 'Mua quà sinh nhật cho mẹ', 'Gợi ý: Hoa và bánh kem', 'DONE', 'LOW', DATE_SUB(NOW(), INTERVAL 1 DAY), 5, NOW(), NOW()),
    (2, 'Tập thể dục buổi sáng', 'Chạy bộ 30 phút và giãn cơ', 'DONE', 'LOW', DATE_SUB(NOW(), INTERVAL 2 DAY), 4, NOW(), NOW()),
    (2, 'Đi siêu thị cuối tuần', 'Mua đồ ăn, nước rửa chén, sữa, trái cây', 'PENDING', 'MEDIUM', DATE_ADD(NOW(), INTERVAL 2 DAY), 3, NOW(), NOW()),
    (2, 'Cập nhật báo cáo tháng', 'Tổng hợp số liệu và gửi cho quản lý', 'IN_PROGRESS', 'HIGH', DATE_ADD(NOW(), INTERVAL 4 DAY), 1, NOW(), NOW()),
    (2, 'Lên kế hoạch du lịch Đà Lạt', 'Đặt vé xe, phòng khách sạn và sắp xếp lịch trình', 'PENDING', 'MEDIUM', DATE_ADD(NOW(), INTERVAL 10 DAY), 2, NOW(), NOW()),
    (2, 'Đọc sách "Atomic Habits"', 'Đọc ít nhất 20 trang mỗi ngày', 'PENDING', 'LOW', DATE_ADD(NOW(), INTERVAL 5 DAY), 2, NOW(), NOW());

-- Công việc con
INSERT INTO todos (user_id, title, description, status, priority, parent_id, created_at, updated_at)
VALUES 
    (2, 'Tạo biểu mẫu tài liệu', 'Tạo template chuẩn cho phần mô tả API', 'DONE', 'HIGH', 1, NOW(), NOW()),
    (2, 'Viết phần giới thiệu', 'Mô tả mục tiêu và chức năng chính', 'IN_PROGRESS', 'MEDIUM', 1, NOW(), NOW()),
    (2, 'Cập nhật hình minh họa', 'Chèn hình ảnh hướng dẫn thao tác', 'PENDING', 'LOW', 1, NOW(), NOW());

-- Gắn thẻ cho công việc
INSERT INTO todo_tags (todo_id, tag_id)
VALUES 
    (1, 2), -- Hoàn thiện tài liệu dự án: Quan trọng
    (2, 3), -- Họp nhóm sáng thứ 2: Họp
    (5, 1), -- Đi siêu thị: Khẩn cấp
    (6, 2), -- Cập nhật báo cáo tháng: Quan trọng
    (6, 5), -- Theo dõi tiến độ
    (7, 4), -- Lên kế hoạch du lịch: Ghi chú
    (8, 5); -- Đọc sách: Theo dõi

-- File đính kèm mẫu
INSERT INTO attachments (todo_id, file_name, file_url, file_size, created_at, updated_at)
VALUES 
    (1, 'tai-lieu-huong-dan.pdf', 'https://example.com/files/tai-lieu-huong-dan.pdf', 256000, NOW(), NOW()),
    (2, 'ke-hoach-hop-nhom.docx', 'https://example.com/files/ke-hoach-hop-nhom.docx', 128000, NOW(), NOW()),
    (7, 'lich-trinh-du-lich.xlsx', 'https://example.com/files/lich-trinh-du-lich.xlsx', 192000, NOW(), NOW());

-- ========================================
-- HOÀN THÀNH!
-- ========================================
-- Tài khoản đăng nhập:
-- - Quản trị: admin@todo.local / Admin@123
-- - Người dùng: nguoidung@todo.local / Admin@123
-- ========================================
