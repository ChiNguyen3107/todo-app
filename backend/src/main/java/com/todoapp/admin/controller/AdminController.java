package com.todoapp.admin.controller;

import com.todoapp.admin.dto.AdminDashboardStats;
import com.todoapp.admin.dto.UserManagementResponse;
import com.todoapp.admin.service.AdminService;
import com.todoapp.todos.entity.Todo;
import com.todoapp.todos.entity.Category;
import com.todoapp.todos.entity.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get admin dashboard statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        log.info("Getting admin dashboard statistics");
        AdminDashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users with pagination")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserManagementResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String search) {
        
        log.info("Getting all users - page: {}, size: {}, sortBy: {}, search: {}", 
                page, size, sortBy, search);
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<UserManagementResponse> users = adminService.getAllUsers(pageable, search);
        
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Get user details by ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserManagementResponse> getUserById(@PathVariable Long userId) {
        log.info("Getting user details for ID: {}", userId);
        UserManagementResponse user = adminService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/status")
    @Operation(summary = "Update user status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserManagementResponse> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam String status) {
        log.info("Updating user {} status to: {}", userId, status);
        UserManagementResponse user = adminService.updateUserStatus(userId, status);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/role")
    @Operation(summary = "Update user role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserManagementResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role) {
        log.info("Updating user {} role to: {}", userId, role);
        UserManagementResponse user = adminService.updateUserRole(userId, role);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/todos")
    @Operation(summary = "Get all todos with pagination")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Todo>> getAllTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String search) {
        
        log.info("Getting all todos - page: {}, size: {}, sortBy: {}, search: {}", 
                page, size, sortBy, search);
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Todo> todos = adminService.getAllTodos(pageable, search);
        
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Category>> getAllCategories() {
        log.info("Getting all categories");
        List<Category> categories = adminService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/tags")
    @Operation(summary = "Get all tags")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Tag>> getAllTags() {
        log.info("Getting all tags");
        List<Tag> tags = adminService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @DeleteMapping("/todos/{todoId}")
    @Operation(summary = "Delete todo by ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long todoId) {
        log.info("Deleting todo with ID: {}", todoId);
        adminService.deleteTodo(todoId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/categories/{categoryId}")
    @Operation(summary = "Delete category by ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        log.info("Deleting category with ID: {}", categoryId);
        adminService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/tags/{tagId}")
    @Operation(summary = "Delete tag by ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTag(@PathVariable Long tagId) {
        log.info("Deleting tag with ID: {}", tagId);
        adminService.deleteTag(tagId);
        return ResponseEntity.noContent().build();
    }
}
