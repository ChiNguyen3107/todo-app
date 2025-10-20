package com.todoapp.todos.repository;

import com.todoapp.todos.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Lấy tất cả categories của một user
     * 
     * @param userId ID của user
     * @return Danh sách categories
     */
    List<Category> findByUserId(Long userId);

    /**
     * Kiểm tra trùng tên category trong cùng một user
     * 
     * @param userId ID của user
     * @param name   Tên category
     * @return Category nếu tìm thấy
     */
    Optional<Category> findByUserIdAndName(Long userId, String name);

    /**
     * Validate ownership - lấy category theo ID và user ID
     * 
     * @param id     ID của category
     * @param userId ID của user
     * @return Category nếu user sở hữu
     */
    Optional<Category> findByIdAndUserId(Long id, Long userId);
}
