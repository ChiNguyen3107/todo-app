package com.todoapp.todos.controller;

import com.todoapp.todos.dto.TagRequest;
import com.todoapp.todos.dto.TagResponse;
import com.todoapp.todos.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller xử lý các yêu cầu liên quan đến Tag
 */
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Slf4j
public class TagController {

    private final TagService tagService;

    /**
     * Tạo tag mới
     *
     * @param request TagRequest chứa thông tin tag
     * @return TagResponse với status 201
     */
    @PostMapping
    public ResponseEntity<TagResponse> createTag(@Valid @RequestBody TagRequest request) {
        log.info("POST /api/tags - Tạo tag mới với tên: {}", request.getName());
        TagResponse response = tagService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy tất cả tags của user hiện tại
     *
     * @return Danh sách TagResponse
     */
    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        log.info("GET /api/tags - Lấy danh sách tất cả tags");
        List<TagResponse> response = tagService.getAll();
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tag theo ID
     *
     * @param id ID của tag
     * @return TagResponse
     */
    @GetMapping("/{id}")
    public ResponseEntity<TagResponse> getTagById(@PathVariable Long id) {
        log.info("GET /api/tags/{} - Lấy tag theo ID", id);
        TagResponse response = tagService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật tag
     *
     * @param id      ID của tag cần cập nhật
     * @param request TagRequest chứa thông tin cập nhật
     * @return TagResponse sau khi cập nhật
     */
    @PutMapping("/{id}")
    public ResponseEntity<TagResponse> updateTag(
            @PathVariable Long id,
            @Valid @RequestBody TagRequest request) {
        log.info("PUT /api/tags/{} - Cập nhật tag", id);
        TagResponse response = tagService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa tag
     *
     * @param id ID của tag cần xóa
     * @return Response 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        log.info("DELETE /api/tags/{} - Xóa tag", id);
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
