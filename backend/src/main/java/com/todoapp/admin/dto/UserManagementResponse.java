package com.todoapp.admin.dto;

import com.todoapp.auth.entity.Role;
import com.todoapp.auth.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementResponse {
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private UserStatus status;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    private Long totalTodos;
    private Long completedTodos;
    private Long pendingTodos;
    private Long totalCategories;
    private Long totalTags;
}
