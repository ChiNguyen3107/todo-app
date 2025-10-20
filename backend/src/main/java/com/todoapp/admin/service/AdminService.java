package com.todoapp.admin.service;

import com.todoapp.admin.dto.AdminDashboardStats;
import com.todoapp.admin.dto.UserManagementResponse;
import com.todoapp.auth.entity.Role;
import com.todoapp.auth.entity.User;
import com.todoapp.auth.entity.UserStatus;
import com.todoapp.auth.repository.UserRepository;
import com.todoapp.todos.entity.Category;
import com.todoapp.todos.entity.Tag;
import com.todoapp.todos.entity.Todo;
import com.todoapp.todos.entity.TodoStatus;
import com.todoapp.todos.repository.CategoryRepository;
import com.todoapp.todos.repository.TagRepository;
import com.todoapp.todos.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final TodoRepository todoRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public AdminDashboardStats getDashboardStats() {
        log.info("Calculating admin dashboard statistics");

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        LocalDateTime startOfWeek = LocalDate.now().minusWeeks(1).atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().minusMonths(1).atStartOfDay();

        // User statistics
        Long totalUsers = userRepository.count();
        Long activeUsers = userRepository.countByStatus(UserStatus.ACTIVE);
        Long inactiveUsers = totalUsers - activeUsers;

        // Todo statistics
        Long totalTodos = todoRepository.count();
        Long completedTodos = todoRepository.countByStatus(TodoStatus.DONE);
        Long pendingTodos = todoRepository.countByStatus(TodoStatus.PENDING);
        Long inProgressTodos = todoRepository.countByStatus(TodoStatus.IN_PROGRESS);
        Long canceledTodos = todoRepository.countByStatus(TodoStatus.CANCELED);

        // Category and Tag statistics
        Long totalCategories = categoryRepository.count();
        Long totalTags = tagRepository.count();

        // Today's statistics
        Long todosCreatedToday = todoRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        Long todosCompletedToday = todoRepository.countByCompletedAtBetween(startOfDay, endOfDay);
        Long usersRegisteredToday = userRepository.countByCreatedAtBetween(startOfDay, endOfDay);

        // Weekly and Monthly statistics
        Long usersRegisteredThisWeek = userRepository.countByCreatedAtBetween(startOfWeek, LocalDateTime.now());
        Long usersRegisteredThisMonth = userRepository.countByCreatedAtBetween(startOfMonth, LocalDateTime.now());

        return AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .totalTodos(totalTodos)
                .completedTodos(completedTodos)
                .pendingTodos(pendingTodos)
                .inProgressTodos(inProgressTodos)
                .canceledTodos(canceledTodos)
                .totalCategories(totalCategories)
                .totalTags(totalTags)
                .todosCreatedToday(todosCreatedToday)
                .todosCompletedToday(todosCompletedToday)
                .usersRegisteredToday(usersRegisteredToday)
                .usersRegisteredThisWeek(usersRegisteredThisWeek)
                .usersRegisteredThisMonth(usersRegisteredThisMonth)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    public Page<UserManagementResponse> getAllUsers(Pageable pageable, String search) {
        log.info("Getting all users with pagination - page: {}, size: {}, search: {}", 
                pageable.getPageNumber(), pageable.getPageSize(), search);

        Page<User> users;
        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(
                    search, search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(this::mapToUserManagementResponse);
    }

    public UserManagementResponse getUserById(Long userId) {
        log.info("Getting user by ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return mapToUserManagementResponse(user);
    }

    @Transactional
    public UserManagementResponse updateUserStatus(Long userId, String status) {
        log.info("Updating user {} status to: {}", userId, status);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setStatus(UserStatus.valueOf(status.toUpperCase()));
        User savedUser = userRepository.save(user);
        
        return mapToUserManagementResponse(savedUser);
    }

    @Transactional
    public UserManagementResponse updateUserRole(Long userId, String role) {
        log.info("Updating user {} role to: {}", userId, role);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setRole(Role.valueOf(role.toUpperCase()));
        User savedUser = userRepository.save(user);
        
        return mapToUserManagementResponse(savedUser);
    }

    public Page<Todo> getAllTodos(Pageable pageable, String search) {
        log.info("Getting all todos with pagination - page: {}, size: {}, search: {}", 
                pageable.getPageNumber(), pageable.getPageSize(), search);

        if (search != null && !search.trim().isEmpty()) {
            return todoRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                    search, search, pageable);
        } else {
            return todoRepository.findAll(pageable);
        }
    }

    public List<Category> getAllCategories() {
        log.info("Getting all categories");
        return categoryRepository.findAll();
    }

    public List<Tag> getAllTags() {
        log.info("Getting all tags");
        return tagRepository.findAll();
    }

    @Transactional
    public void deleteTodo(Long todoId) {
        log.info("Deleting todo with ID: {}", todoId);
        if (!todoRepository.existsById(todoId)) {
            throw new RuntimeException("Todo not found with id: " + todoId);
        }
        todoRepository.deleteById(todoId);
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        log.info("Deleting category with ID: {}", categoryId);
        if (!categoryRepository.existsById(categoryId)) {
            throw new RuntimeException("Category not found with id: " + categoryId);
        }
        categoryRepository.deleteById(categoryId);
    }

    @Transactional
    public void deleteTag(Long tagId) {
        log.info("Deleting tag with ID: {}", tagId);
        if (!tagRepository.existsById(tagId)) {
            throw new RuntimeException("Tag not found with id: " + tagId);
        }
        tagRepository.deleteById(tagId);
    }

    private UserManagementResponse mapToUserManagementResponse(User user) {
        // Get user's todo statistics
        Long totalTodos = todoRepository.countByUserId(user.getId());
        Long completedTodos = todoRepository.countByUserIdAndStatus(user.getId(), TodoStatus.DONE);
        Long pendingTodos = todoRepository.countByUserIdAndStatus(user.getId(), TodoStatus.PENDING);
        Long totalCategories = categoryRepository.countByUserId(user.getId());
        Long totalTags = tagRepository.countByUserId(user.getId());

        return UserManagementResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLoginAt(null) // TODO: Add last login tracking
                .totalTodos(totalTodos)
                .completedTodos(completedTodos)
                .pendingTodos(pendingTodos)
                .totalCategories(totalCategories)
                .totalTags(totalTags)
                .build();
    }
}
