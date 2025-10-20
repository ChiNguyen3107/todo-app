package com.todoapp.todos.dto;

import lombok.*;

import java.util.List;

/**
 * DTO cho response todo chi tiết (bao gồm subtasks và attachments đầy đủ)
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TodoDetailResponse extends TodoResponse {

    private List<TodoResponse> subtasks;

    private List<AttachmentResponse> attachments;

    @Builder(builderMethodName = "detailBuilder")
    public TodoDetailResponse(
            Long id,
            String title,
            String description,
            com.todoapp.todos.entity.TodoStatus status,
            com.todoapp.todos.entity.TodoPriority priority,
            java.time.LocalDateTime dueDate,
            java.time.LocalDateTime remindAt,
            Integer estimatedMinutes,
            Long parentId,
            CategoryResponse category,
            java.util.Set<TagResponse> tags,
            Integer subtasksCount,
            Integer attachmentsCount,
            java.time.LocalDateTime createdAt,
            Long createdBy,
            java.time.LocalDateTime updatedAt,
            Long updatedBy,
            java.time.LocalDateTime deletedAt,
            List<TodoResponse> subtasks,
            List<AttachmentResponse> attachments) {
        super(id, title, description, status, priority, dueDate, remindAt, estimatedMinutes,
                parentId, category, tags, subtasksCount, attachmentsCount,
                createdAt, createdBy, updatedAt, updatedBy, deletedAt);
        this.subtasks = subtasks;
        this.attachments = attachments;
    }
}
