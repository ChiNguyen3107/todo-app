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
 * DTO cho request tìm kiếm/filter todos
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoSearchRequest {

    private String query;

    private TodoStatus status;

    private TodoPriority priority;

    private Long categoryId;

    private Set<Long> tagIds;

    private LocalDateTime dueFrom;

    private LocalDateTime dueTo;
}
