package com.todoapp.todos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho request tạo/cập nhật category
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    
    @NotBlank(message = "Tên category không được để trống")
    @Size(min = 1, max = 50, message = "Tên category phải từ 1-50 ký tự")
    private String name;
    
    @NotBlank(message = "Màu sắc không được để trống")
    @Size(min = 3, max = 7, message = "Màu sắc phải là mã hex hợp lệ (vd: #FF5733)")
    private String color;
    
    private Integer orderIndex;
}
