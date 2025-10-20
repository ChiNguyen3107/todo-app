package com.todoapp.todos.dto;

import com.todoapp.todos.entity.TodoPriority;
import com.todoapp.todos.entity.TodoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO cho response todo cơ bản
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoResponse {

    private Long id;

    private String title;

    private String description;

    private TodoStatus status;

    private TodoPriority priority;

    private LocalDateTime dueDate;

    private LocalDateTime remindAt;

    private Integer estimatedMinutes;

    private Long parentId;

    private CategoryResponse category;

    private Set<TagResponse> tags;

    private Integer subtasksCount;

    private Integer attachmentsCount;

    private LocalDateTime createdAt;

    private Long createdBy;

    private LocalDateTime updatedAt;

    private Long updatedBy;

    private LocalDateTime deletedAt;
}
