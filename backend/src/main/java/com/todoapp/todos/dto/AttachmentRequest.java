package com.todoapp.todos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho request thêm attachment
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentRequest {

    @NotBlank(message = "Tên file không được để trống")
    @Size(max = 255, message = "Tên file không được vượt quá 255 ký tự")
    private String fileName;

    @NotBlank(message = "URL file không được để trống")
    @Size(max = 500, message = "URL file không được vượt quá 500 ký tự")
    private String fileUrl;

    @NotNull(message = "Kích thước file không được để trống")
    private Long fileSize;
}
