package com.todoapp.user.dto;

import com.todoapp.auth.entity.Role;
import com.todoapp.auth.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO trả về thông tin User
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private Long id;
    
    private String email;
    
    private String fullName;
    
    private Role role;
    
    private Boolean emailVerified;
    
    private UserStatus status;
    
    private LocalDateTime createdAt;
}
