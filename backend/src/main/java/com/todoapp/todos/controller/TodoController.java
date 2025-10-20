package com.todoapp.todos.controller;

import com.todoapp.todos.dto.*;
import com.todoapp.todos.entity.TodoStatus;
import com.todoapp.todos.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller xử lý các API endpoints liên quan đến Todo
 */
@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@Slf4j
public class TodoController {

    private final TodoService todoService;

    /**
     * Tạo todo mới
     *
     * @param request TodoRequest chứa thông tin todo
     * @return TodoResponse
     */
    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoRequest request) {
        log.info("POST /api/todos - Tạo todo mới");
        TodoResponse response = todoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy danh sách todos với phân trang
     *
     * @param page Số trang (mặc định: 0)
     * @param size Kích thước trang (mặc định: 20)
     * @param sort Trường sắp xếp (mặc định: createdAt,desc)
     * @return Page chứa TodoResponse
     */
    @GetMapping
    public ResponseEntity<Page<TodoResponse>> getAllTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
        log.info("GET /api/todos - Lấy danh sách todos");

        Pageable pageable = createPageable(page, size, sort);
        Page<TodoResponse> todos = todoService.getAll(pageable);

        return ResponseEntity.ok(todos);
    }

    /**
     * Lấy chi tiết một todo
     *
     * @param id ID của todo
     * @return TodoDetailResponse
     */
    @GetMapping("/{id}")
    public ResponseEntity<TodoDetailResponse> getTodoById(@PathVariable Long id) {
        log.info("GET /api/todos/{} - Lấy chi tiết todo", id);
        TodoDetailResponse response = todoService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật todo
     *
     * @param id      ID của todo
     * @param request TodoRequest chứa thông tin cập nhật
     * @return TodoResponse
     */
    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoRequest request) {
        log.info("PUT /api/todos/{} - Cập nhật todo", id);
        TodoResponse response = todoService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa todo (soft delete)
     *
     * @param id ID của todo
     * @return ResponseEntity không có body
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        log.info("DELETE /api/todos/{} - Xóa todo", id);
        todoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Cập nhật trạng thái todo
     *
     * @param id     ID của todo
     * @param status Trạng thái mới
     * @return TodoResponse
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TodoResponse> updateTodoStatus(
            @PathVariable Long id,
            @RequestParam TodoStatus status) {
        log.info("PATCH /api/todos/{}/status - Cập nhật trạng thái sang {}", id, status);
        TodoResponse response = todoService.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm todos nâng cao
     *
     * @param searchRequest TodoSearchRequest chứa các điều kiện tìm kiếm
     * @param page          Số trang (mặc định: 0)
     * @param size          Kích thước trang (mặc định: 20)
     * @param sort          Trường sắp xếp (mặc định: createdAt,desc)
     * @return Page chứa TodoResponse
     */
    @GetMapping("/search")
    public ResponseEntity<Page<TodoResponse>> searchTodos(
            @ModelAttribute TodoSearchRequest searchRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
        log.info("GET /api/todos/search - Tìm kiếm todos với điều kiện: {}", searchRequest);

        Pageable pageable = createPageable(page, size, sort);
        Page<TodoResponse> todos = todoService.search(searchRequest, pageable);

        return ResponseEntity.ok(todos);
    }

    /**
     * Tạo subtask cho todo
     *
     * @param id      ID của todo cha
     * @param request TodoRequest chứa thông tin subtask
     * @return TodoResponse
     */
    @PostMapping("/{id}/subtasks")
    public ResponseEntity<TodoResponse> createSubtask(
            @PathVariable Long id,
            @Valid @RequestBody TodoRequest request) {
        log.info("POST /api/todos/{}/subtasks - Tạo subtask", id);
        TodoResponse response = todoService.createSubtask(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy danh sách subtasks của todo
     *
     * @param id ID của todo cha
     * @return List chứa TodoResponse
     */
    @GetMapping("/{id}/subtasks")
    public ResponseEntity<List<TodoResponse>> getSubtasks(@PathVariable Long id) {
        log.info("GET /api/todos/{}/subtasks - Lấy danh sách subtasks", id);
        List<TodoResponse> subtasks = todoService.getSubtasks(id);
        return ResponseEntity.ok(subtasks);
    }

    /**
     * Lấy danh sách todos đã xóa
     *
     * @param page Số trang (mặc định: 0)
     * @param size Kích thước trang (mặc định: 20)
     * @param sort Trường sắp xếp (mặc định: deletedAt,desc)
     * @return Page chứa TodoResponse
     */
    @GetMapping("/trash")
    public ResponseEntity<Page<TodoResponse>> getTrashedTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "deletedAt,desc") String[] sort) {
        log.info("GET /api/todos/trash - Lấy danh sách todos đã xóa");

        Pageable pageable = createPageable(page, size, sort);
        Page<TodoResponse> trashedTodos = todoService.getTrashed(pageable);

        return ResponseEntity.ok(trashedTodos);
    }

    /**
     * Khôi phục todo từ trash
     *
     * @param id ID của todo
     * @return TodoResponse
     */
    @PostMapping("/{id}/restore")
    public ResponseEntity<TodoResponse> restoreTodo(@PathVariable Long id) {
        log.info("POST /api/todos/{}/restore - Khôi phục todo", id);
        TodoResponse response = todoService.restore(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thống kê todos
     *
     * @return Map chứa thống kê
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        log.info("GET /api/todos/statistics - Lấy thống kê todos");
        Map<String, Long> statistics = todoService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Tạo Pageable từ các tham số
     *
     * @param page Số trang
     * @param size Kích thước trang
     * @param sort Mảng sort (format: property,direction)
     * @return Pageable
     */
    private Pageable createPageable(int page, int size, String[] sort) {
        // Parse sort parameter
        String property = sort[0];
        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return PageRequest.of(page, size, Sort.by(direction, property));
    }
}

