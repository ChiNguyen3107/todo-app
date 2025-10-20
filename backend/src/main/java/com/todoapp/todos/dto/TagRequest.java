package com.todoapp.todos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho request tạo/cập nhật tag
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagRequest {

    @NotBlank(message = "Tên tag không được để trống")
    @Size(min = 1, max = 50, message = "Tên tag phải từ 1-50 ký tự")
    private String name;

    @NotBlank(message = "Màu sắc không được để trống")
    @Size(min = 3, max = 7, message = "Màu sắc phải là mã hex hợp lệ (vd: #FF5733)")
    private String color;
}
