package com.todoapp.todos.dto;

import com.todoapp.todos.entity.TodoPriority;
import com.todoapp.todos.entity.TodoStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO cho request tạo/cập nhật todo
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề không được vượt quá 255 ký tự")
    private String title;

    @Size(max = 5000, message = "Mô tả không được vượt quá 5000 ký tự")
    private String description;

    @NotNull(message = "Trạng thái không được để trống")
    private TodoStatus status;

    @NotNull(message = "Độ ưu tiên không được để trống")
    private TodoPriority priority;

    private LocalDateTime dueDate;

    private LocalDateTime remindAt;

    private Integer estimatedMinutes;

    private Long categoryId;

    private Set<Long> tagIds;
}
