package com.todoapp.todos.service;

import com.todoapp.auth.entity.User;
import com.todoapp.auth.repository.UserRepository;
import com.todoapp.common.exception.BadRequestException;
import com.todoapp.common.exception.ResourceNotFoundException;
import com.todoapp.todos.dto.CategoryRequest;
import com.todoapp.todos.dto.CategoryResponse;
import com.todoapp.todos.entity.Category;
import com.todoapp.todos.mapper.CategoryMapper;
import com.todoapp.todos.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service xử lý logic nghiệp vụ cho Category
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserRepository userRepository;

    /**
     * Tạo category mới
     *
     * @param request CategoryRequest
     * @return CategoryResponse
     */
    public CategoryResponse create(CategoryRequest request) {
        log.info("Tạo category mới: {}", request.getName());
        
        // Lấy user hiện tại
        User currentUser = getCurrentUser();
        
        // Kiểm tra trùng tên
        if (categoryRepository.findByUserIdAndName(currentUser.getId(), request.getName()).isPresent()) {
            throw new IllegalArgumentException("Tên category đã tồn tại");
        }
        
        // Tạo entity
        Category category = categoryMapper.toEntity(request);
        category.setUser(currentUser);
        
        // Lưu vào database
        Category savedCategory = categoryRepository.save(category);
        
        log.info("Tạo category thành công với ID: {}", savedCategory.getId());
        return categoryMapper.toResponse(savedCategory);
    }

    /**
     * Lấy tất cả categories của user hiện tại
     *
     * @return List<CategoryResponse>
     */
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        log.info("Lấy danh sách categories của user hiện tại");
        
        User currentUser = getCurrentUser();
        List<Category> categories = categoryRepository.findByUserId(currentUser.getId());
        
        log.info("Tìm thấy {} categories", categories.size());
        return categoryMapper.toResponseList(categories);
    }

    /**
     * Lấy category theo ID
     *
     * @param id ID của category
     * @return CategoryResponse
     */
    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        log.info("Lấy category theo ID: {}", id);
        
        User currentUser = getCurrentUser();
        Category category = categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Category không tồn tại"));
        
        return categoryMapper.toResponse(category);
    }

    /**
     * Cập nhật category
     *
     * @param id      ID của category
     * @param request CategoryRequest
     * @return CategoryResponse
     */
    public CategoryResponse update(Long id, CategoryRequest request) {
        log.info("Cập nhật category ID: {}", id);
        
        User currentUser = getCurrentUser();
        Category category = categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Category không tồn tại"));
        
        // Kiểm tra trùng tên (nếu tên thay đổi)
        if (!category.getName().equals(request.getName())) {
            if (categoryRepository.findByUserIdAndName(currentUser.getId(), request.getName()).isPresent()) {
                throw new IllegalArgumentException("Tên category đã tồn tại");
            }
        }
        
        // Cập nhật thông tin
        category.setName(request.getName());
        category.setColor(request.getColor());
        category.setOrderIndex(request.getOrderIndex());
        
        Category updatedCategory = categoryRepository.save(category);
        
        log.info("Cập nhật category thành công");
        return categoryMapper.toResponse(updatedCategory);
    }

    /**
     * Xóa category
     *
     * @param id ID của category
     */
    public void delete(Long id) {
        log.info("Xóa category ID: {}", id);
        
        User currentUser = getCurrentUser();
        Category category = categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Category không tồn tại"));
        
        // TODO: Kiểm tra xem category có đang được sử dụng bởi todo nào không
        // Nếu có, có thể throw exception hoặc xóa cascade
        
        categoryRepository.delete(category);
        
        log.info("Xóa category thành công");
    }

    /**
     * Lấy user hiện tại từ SecurityContext
     *
     * @return User entity
     * @throws BadRequestException       nếu không tìm thấy authentication
     * @throws ResourceNotFoundException nếu không tìm thấy user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Không tìm thấy thông tin xác thực");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với email: " + email));
    }
}
