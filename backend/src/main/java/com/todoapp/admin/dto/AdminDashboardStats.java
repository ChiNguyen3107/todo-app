package com.todoapp.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    private Long totalUsers;
    private Long activeUsers;
    private Long inactiveUsers;
    private Long totalTodos;
    private Long completedTodos;
    private Long pendingTodos;
    private Long inProgressTodos;
    private Long canceledTodos;
    private Long totalCategories;
    private Long totalTags;
    private Long todosCreatedToday;
    private Long todosCompletedToday;
    private Long usersRegisteredToday;
    private Long usersRegisteredThisWeek;
    private Long usersRegisteredThisMonth;
    private LocalDateTime lastUpdated;
}
