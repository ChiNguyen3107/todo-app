-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 27, 2025 lúc 08:03 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `tododb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attachments`
--

CREATE TABLE `attachments` (
  `id` bigint(20) NOT NULL,
  `todo_id` bigint(20) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `attachments`
--

INSERT INTO `attachments` (`id`, `todo_id`, `file_name`, `file_url`, `file_size`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 1, 'tai-lieu-huong-dan.pdf', 'https://example.com/files/tai-lieu-huong-dan.pdf', 256000, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(2, 2, 'ke-hoach-hop-nhom.docx', 'https://example.com/files/ke-hoach-hop-nhom.docx', 128000, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(3, 7, 'lich-trinh-du-lich.xlsx', 'https://example.com/files/lich-trinh-du-lich.xlsx', 192000, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  `order_index` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `name`, `color`, `order_index`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 2, 'Công việc', '#3B82F6', 1, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(2, 2, 'Cá nhân', '#10B981', 2, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(3, 2, 'Mua sắm', '#F59E0B', 3, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(4, 2, 'Sức khỏe', '#8B5CF6', 4, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(5, 2, 'Gia đình', '#F43F5E', 5, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(6, 3, 'dqdq', '#ef4444', NULL, '2025-10-21 00:33:05', NULL, '2025-10-21 00:33:05', NULL),
(7, 4, 'ưefwefwef', '#ef4444', NULL, '2025-10-22 01:27:43', NULL, '2025-10-22 01:27:43', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` bigint(20) NOT NULL,
  `token` varchar(500) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `revoked` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `token`, `user_id`, `expires_at`, `revoked`, `created_at`) VALUES
(1, '87d973f2-5726-4fac-b410-07b7310abcaa', 3, '2025-10-27 09:18:15', 0, '2025-10-20 09:18:15'),
(2, '59839474-8f05-4615-8fa1-fe48a76db89f', 3, '2025-10-27 09:19:00', 0, '2025-10-20 09:19:00'),
(3, '1848853f-0b88-4e3a-888b-d15cfaeb2f09', 4, '2025-10-27 19:28:07', 0, '2025-10-20 19:28:07'),
(4, '43c4cf56-0bbf-488a-84a9-74a9ede7a6fe', 3, '2025-10-27 19:28:18', 0, '2025-10-20 19:28:18'),
(5, 'dba14751-e66f-49cf-99e1-c1cadd72883b', 3, '2025-10-27 19:37:11', 0, '2025-10-20 19:37:11'),
(6, 'ecc9fbd5-0a41-432b-add7-26d29dcd6a17', 3, '2025-10-27 19:54:12', 0, '2025-10-20 19:54:12'),
(7, '4c64d49a-ef41-4d0f-84e6-e9d892bdf4a1', 4, '2025-10-27 19:57:33', 0, '2025-10-20 19:57:33'),
(8, 'c2cc56a2-90ab-4aee-a70a-b3f729be4e29', 4, '2025-10-27 20:02:42', 0, '2025-10-20 20:02:42'),
(9, '7667ff60-55ac-401a-993a-755d11a9ccc0', 3, '2025-10-27 20:03:06', 0, '2025-10-20 20:03:06'),
(10, '41d27f50-2b30-4ac5-8153-b29db1c39568', 2, '2025-10-27 20:04:32', 0, '2025-10-20 20:04:32'),
(11, 'cafb08d1-851d-4619-9281-94f493119d3b', 3, '2025-10-27 23:44:09', 0, '2025-10-20 23:44:09'),
(12, '4653f443-0984-4d92-b260-fe72477dabe1', 3, '2025-10-27 23:54:30', 0, '2025-10-20 23:54:30'),
(13, 'dab9db72-c7f9-44ce-8502-68357e2deb2b', 4, '2025-10-27 23:54:42', 0, '2025-10-20 23:54:42'),
(14, '79de8470-232a-4d34-ad03-d13731c0316c', 4, '2025-10-28 00:02:11', 0, '2025-10-21 00:02:11'),
(15, '9c7cc42b-8c22-4d7d-8e8a-dc594ccc2a70', 4, '2025-10-28 00:06:00', 0, '2025-10-21 00:06:00'),
(16, 'ce6ec5ae-1eb8-4c08-a0c0-533d36ae5c20', 3, '2025-10-28 00:15:24', 0, '2025-10-21 00:15:24'),
(17, 'c09dd6c4-d243-46e6-b101-afe3461e30a1', 3, '2025-10-28 00:50:37', 0, '2025-10-21 00:50:37'),
(18, '9d39aca2-05a1-4f06-8338-e951b64e194f', 3, '2025-10-29 01:00:49', 0, '2025-10-22 01:00:49'),
(19, 'cbd4d1f6-7fce-48b4-b129-27e6f53607c0', 3, '2025-10-29 01:06:19', 0, '2025-10-22 01:06:19'),
(20, '9e45e742-8bd3-4bdc-b536-8f0359370ce5', 3, '2025-10-29 01:22:03', 0, '2025-10-22 01:22:03'),
(21, '22227841-73c1-41c0-abfc-35371dff3c87', 3, '2025-10-29 01:27:19', 0, '2025-10-22 01:27:19'),
(22, 'eab39b43-8511-4880-8996-4aca056c9b28', 4, '2025-10-29 01:27:34', 0, '2025-10-22 01:27:34'),
(23, '9958ff68-b3e5-45d8-b26e-66df0da2cbef', 3, '2025-10-29 02:19:51', 0, '2025-10-22 02:19:51'),
(24, '0fe94140-e460-4f80-b62d-29288b694286', 3, '2025-10-29 23:41:25', 0, '2025-10-22 23:41:25'),
(25, '782eb2a5-9915-47bd-ae4d-37d45e89226c', 3, '2025-10-29 23:50:12', 0, '2025-10-22 23:50:12'),
(26, '650edec5-5303-490d-aa19-bdf7ce77665f', 3, '2025-10-29 23:59:03', 0, '2025-10-22 23:59:03'),
(27, 'c73d822f-4dd4-4f99-901d-ba004385a23a', 3, '2025-10-30 00:27:06', 0, '2025-10-23 00:27:06'),
(28, '4ff8b249-3d62-4870-9495-95b24fcce20b', 3, '2025-10-30 00:34:51', 0, '2025-10-23 00:34:51'),
(29, '8219991b-3b9e-4c3f-a226-c76a4dea7412', 3, '2025-10-30 00:38:52', 0, '2025-10-23 00:38:52'),
(30, 'ebf87f8c-e09a-4461-b08a-01f530d36fcb', 3, '2025-10-30 00:46:07', 0, '2025-10-23 00:46:07'),
(31, '7a2718c6-fa7a-4e3d-a353-44a19f336569', 2, '2025-10-30 01:54:05', 0, '2025-10-23 01:54:05'),
(32, '3169a30f-88f5-4539-a648-7781f148a961', 2, '2025-10-30 02:07:15', 0, '2025-10-23 02:07:15'),
(33, '5c0ed20c-2252-4ae7-bd22-055651b2139c', 3, '2025-10-30 22:06:43', 0, '2025-10-23 22:06:43'),
(34, '68ee6114-52b9-45df-b712-a4e95428cbf9', 2, '2025-11-02 23:37:10', 0, '2025-10-26 23:37:10'),
(35, 'c15b2c00-d3ff-452d-87ba-1c5b233c5366', 2, '2025-11-02 23:49:56', 0, '2025-10-26 23:49:56'),
(36, '5dbefd0d-0e38-42a9-936a-17f4e300c4a1', 2, '2025-11-02 23:53:15', 0, '2025-10-26 23:53:15'),
(37, 'c67ee687-9536-4fe7-bab1-7943376c10a9', 2, '2025-11-03 00:00:29', 0, '2025-10-27 00:00:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tags`
--

INSERT INTO `tags` (`id`, `user_id`, `name`, `color`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 2, 'Khẩn cấp', '#EF4444', '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(2, 2, 'Quan trọng', '#F59E0B', '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(3, 2, 'Họp', '#06B6D4', '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(4, 2, 'Ghi chú', '#8B5CF6', '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(5, 2, 'Theo dõi', '#22C55E', '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(6, 3, 'qưdwdqwd', '#ef4444', '2025-10-21 00:33:09', NULL, '2025-10-21 00:33:09', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `todos`
--

CREATE TABLE `todos` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'PENDING',
  `priority` varchar(20) NOT NULL DEFAULT 'MEDIUM',
  `due_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `remind_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `estimated_minutes` int(11) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` bigint(20) DEFAULT NULL,
  `deleted_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `todos`
--

INSERT INTO `todos` (`id`, `user_id`, `title`, `description`, `status`, `priority`, `due_date`, `remind_at`, `estimated_minutes`, `parent_id`, `category_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`) VALUES
(1, 2, 'Hoàn thiện tài liệu dự án', 'Viết tài liệu hướng dẫn sử dụng và API cho ứng dụng Todo', 'IN_PROGRESS', 'HIGH', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, NULL, 1, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(2, 2, 'Họp nhóm sáng thứ 2', 'Chuẩn bị nội dung thảo luận và báo cáo tiến độ tuần', 'PENDING', 'MEDIUM', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, NULL, 1, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(3, 2, 'Mua quà sinh nhật cho mẹ', 'Gợi ý: Hoa và bánh kem', 'DONE', 'LOW', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, NULL, 5, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(4, 2, 'Tập thể dục buổi sáng', 'Chạy bộ 30 phút và giãn cơ', 'DONE', 'LOW', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, NULL, 4, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(5, 2, 'Đi siêu thị cuối tuần', 'Mua đồ ăn, nước rửa chén, sữa, trái cây', 'PENDING', 'MEDIUM', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, NULL, 3, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(6, 2, 'Cập nhật báo cáo tháng', 'Tổng hợp số liệu và gửi cho quản lý', 'IN_PROGRESS', 'HIGH', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, NULL, 1, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(7, 2, 'Lên kế hoạch du lịch Đà Lạt', 'Đặt vé xe, phòng khách sạn và sắp xếp lịch trình', 'PENDING', 'MEDIUM', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, NULL, 2, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(8, 2, 'Đọc sách \"Atomic Habits\"', 'Đọc ít nhất 20 trang mỗi ngày', 'PENDING', 'LOW', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, NULL, 2, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(9, 2, 'Tạo biểu mẫu tài liệu', 'Tạo template chuẩn cho phần mô tả API', 'DONE', 'HIGH', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, 1, NULL, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(10, 2, 'Viết phần giới thiệu', 'Mô tả mục tiêu và chức năng chính', 'IN_PROGRESS', 'MEDIUM', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, 1, NULL, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(11, 2, 'Cập nhật hình minh họa', 'Chèn hình ảnh hướng dẫn thao tác', 'PENDING', 'LOW', '2025-10-27 07:02:10', '0000-00-00 00:00:00', NULL, 1, NULL, '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL, '2025-10-27 07:02:10'),
(12, 2, 'Gặp đối tác 11h30', '', 'PENDING', 'HIGH', '2025-10-27 07:02:10', '2025-10-21 03:05:15', NULL, NULL, 1, '2025-10-20 20:05:15', 2, '2025-10-20 20:05:15', 2, '2025-10-27 07:02:10'),
(13, 3, 'ưqdqw', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-21 07:33:18', NULL, NULL, 6, '2025-10-21 00:33:18', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(14, 3, 'egr', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-21 07:37:19', NULL, NULL, 6, '2025-10-21 00:37:19', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(15, 3, 'wrgwrfw', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-21 07:37:35', NULL, NULL, 6, '2025-10-21 00:37:35', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(16, 3, '4ggg', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-21 07:50:48', NULL, NULL, 6, '2025-10-21 00:50:48', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(17, 3, 'ewefw', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-21 07:54:08', NULL, NULL, 6, '2025-10-21 00:54:08', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(18, 3, 'egreve', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-21 07:56:06', NULL, NULL, 6, '2025-10-21 00:56:06', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(19, 3, 'ửgwrg', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-21 08:00:24', NULL, NULL, 6, '2025-10-21 01:00:24', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(20, 3, 'htsry', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-22 08:01:03', NULL, NULL, 6, '2025-10-22 01:01:03', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(21, 3, 'etgegegt', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-22 08:01:26', NULL, NULL, 6, '2025-10-22 01:01:26', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(22, 3, 'dư', 'dqwdwd', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-22 08:22:12', NULL, NULL, 6, '2025-10-22 01:22:12', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(23, 4, 'ưefwf', '', 'PENDING', 'MEDIUM', '2025-10-22 09:19:03', '2025-10-22 08:27:50', NULL, NULL, 7, '2025-10-22 01:27:50', 4, '2025-10-22 09:19:03', 4, '2025-10-22 09:19:03'),
(24, 4, 'ừef', '', 'PENDING', 'MEDIUM', '2025-10-22 09:19:03', '2025-10-22 08:34:06', NULL, NULL, 7, '2025-10-22 01:34:06', 4, '2025-10-22 09:19:03', 4, '2025-10-22 09:19:03'),
(25, 3, 'dqed', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-23 06:51:19', NULL, NULL, 6, '2025-10-22 23:51:19', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(26, 3, 'eqdq3d', '', 'PENDING', 'MEDIUM', '2025-10-23 07:40:54', '2025-10-23 06:59:20', NULL, NULL, 6, '2025-10-22 23:59:20', 3, '2025-10-23 07:40:54', 3, '2025-10-23 07:40:54'),
(27, 3, 'gbeatb', '', 'PENDING', 'MEDIUM', '2025-10-23 07:46:20', '2025-10-23 07:46:20', NULL, NULL, 6, '2025-10-23 00:46:20', 3, '2025-10-23 00:46:20', 3, '2025-10-23 07:46:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `todo_tags`
--

CREATE TABLE `todo_tags` (
  `todo_id` bigint(20) NOT NULL,
  `tag_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `todo_tags`
--

INSERT INTO `todo_tags` (`todo_id`, `tag_id`) VALUES
(1, 2),
(2, 3),
(5, 1),
(6, 2),
(6, 5),
(7, 4),
(8, 5),
(12, 1),
(13, 6),
(14, 6),
(19, 6),
(25, 6),
(26, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'USER',
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `role`, `email_verified`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'admin@todo.local', '$2a$10$XQ5qYqCGH4VvHKqXqJZGe.rZ9YlQdGZ8C8mJ7jJ0xJ4yJ0J0J0J0J', 'Quản trị viên', 'ADMIN', 1, 'INACTIVE', '2025-10-20 16:08:22', NULL, '2025-10-22 23:55:18', NULL),
(2, 'nguoidung@todo.local', '$2a$10$cfb7I2d58gTMnFjpsep3POM5YB0BEryVThEniGKPSZmFi0LeOkrZ6', 'Người dùng Demo', 'USER', 1, 'ACTIVE', '2025-10-20 16:08:22', NULL, '2025-10-20 16:08:22', NULL),
(3, 'admin@gmail.com', '$2a$10$cfb7I2d58gTMnFjpsep3POM5YB0BEryVThEniGKPSZmFi0LeOkrZ6', 'Admin', 'ADMIN', 1, 'ACTIVE', '2025-10-20 09:18:15', NULL, '2025-10-20 09:18:15', NULL),
(4, 'nguyenpeter0307@gmail.com', '$2a$10$lSimKaen9HVgkYzs5wdxV.Ihlo.jbOVz8dL23SrG02NfPqUttKiQi', 'Chí Nguyễn', 'USER', 0, 'ACTIVE', '2025-10-20 19:28:06', NULL, '2025-10-20 19:28:06', NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `todo_id` (`todo_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_user_name` (`user_id`,`name`);

--
-- Chỉ mục cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_tag_user_name` (`user_id`,`name`);

--
-- Chỉ mục cho bảng `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `todo_tags`
--
ALTER TABLE `todo_tags`
  ADD PRIMARY KEY (`todo_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `attachments`
--
ALTER TABLE `attachments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `todos`
--
ALTER TABLE `todos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`todo_id`) REFERENCES `todos` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `todos`
--
ALTER TABLE `todos`
  ADD CONSTRAINT `todos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `todos_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `todos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `todos_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `todo_tags`
--
ALTER TABLE `todo_tags`
  ADD CONSTRAINT `todo_tags_ibfk_1` FOREIGN KEY (`todo_id`) REFERENCES `todos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `todo_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
