package com.todoapp.todos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO cho response category
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    
    private Long id;
    
    private String name;
    
    private String color;
    
    private Integer orderIndex;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
