package com.todoapp.todos.controller;

import com.todoapp.todos.dto.CategoryRequest;
import com.todoapp.todos.dto.CategoryResponse;
import com.todoapp.todos.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller xử lý các yêu cầu liên quan đến Category
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Tạo category mới
     *
     * @param request CategoryRequest chứa thông tin category
     * @return CategoryResponse với status 201
     */
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        log.info("POST /api/categories - Tạo category mới với tên: {}", request.getName());
        CategoryResponse response = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy tất cả categories của user hiện tại
     *
     * @return Danh sách CategoryResponse
     */
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        log.info("GET /api/categories - Lấy danh sách tất cả categories");
        List<CategoryResponse> response = categoryService.getAll();
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy category theo ID
     *
     * @param id ID của category
     * @return CategoryResponse
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        log.info("GET /api/categories/{} - Lấy category theo ID", id);
        CategoryResponse response = categoryService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật category
     *
     * @param id      ID của category cần cập nhật
     * @param request CategoryRequest chứa thông tin cập nhật
     * @return CategoryResponse sau khi cập nhật
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        log.info("PUT /api/categories/{} - Cập nhật category", id);
        CategoryResponse response = categoryService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa category
     *
     * @param id ID của category cần xóa
     * @return ResponseEntity với status 204
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        log.info("DELETE /api/categories/{} - Xóa category", id);
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
