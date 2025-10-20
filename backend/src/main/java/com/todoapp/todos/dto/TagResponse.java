package com.todoapp.todos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO cho response tag
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagResponse {

    private Long id;

    private String name;

    private String color;

    private LocalDateTime createdAt;
}
