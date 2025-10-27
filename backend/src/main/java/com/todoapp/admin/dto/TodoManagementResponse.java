package com.todoapp.admin.dto;

import com.todoapp.auth.entity.Role;
import com.todoapp.auth.entity.UserStatus;
import com.todoapp.todos.entity.TodoPriority;
import com.todoapp.todos.entity.TodoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoManagementResponse {
    private Long id;
    private String title;
    private String description;
    private TodoStatus status;
    private TodoPriority priority;
    private LocalDateTime dueDate;
    private LocalDateTime remindAt;
    private Integer estimatedMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    
    // User information
    private Long userId;
    private String userEmail;
    private String userFullName;
    private Role userRole;
    private UserStatus userStatus;
    
    // Category information
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    
    // Parent todo information
    private Long parentId;
    private String parentTitle;
    
    // Statistics
    private Integer subtaskCount;
    private Integer attachmentCount;
    private Integer tagCount;
}

