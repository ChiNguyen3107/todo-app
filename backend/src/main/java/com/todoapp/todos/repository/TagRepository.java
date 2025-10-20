package com.todoapp.todos.repository;

import com.todoapp.todos.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * Lấy tất cả tags của một user
     * 
     * @param userId ID của user
     * @return Danh sách tags
     */
    List<Tag> findByUserId(Long userId);

    /**
     * Kiểm tra trùng tên tag trong cùng một user
     * 
     * @param userId ID của user
     * @param name   Tên tag
     * @return Tag nếu tìm thấy
     */
    Optional<Tag> findByUserIdAndName(Long userId, String name);

    /**
     * Validate ownership - lấy tag theo ID và user ID
     * 
     * @param id     ID của tag
     * @param userId ID của user
     * @return Tag nếu user sở hữu
     */
    Optional<Tag> findByIdAndUserId(Long id, Long userId);

    /**
     * Count tags by user ID for admin dashboard
     * 
     * @param userId the ID of the user
     * @return count of tags for the user
     */
    Long countByUserId(Long userId);
}
