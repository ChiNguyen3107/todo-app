package com.todoapp.todos.repository;

import com.todoapp.todos.entity.Todo;
import com.todoapp.todos.entity.TodoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Repository interface for Todo entity.
 * Extends JpaRepository for basic CRUD operations and JpaSpecificationExecutor
 * for dynamic queries.
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long>, JpaSpecificationExecutor<Todo> {

    /**
     * Find all todos that haven't been deleted (soft delete) for a specific user.
     * 
     * @param userId   the ID of the user
     * @param pageable pagination information
     * @return page of todos that are not deleted
     */
    Page<Todo> findByUserIdAndDeletedAtIsNull(Long userId, Pageable pageable);

    /**
     * Find all todos that have been deleted (in trash) for a specific user.
     * 
     * @param userId   the ID of the user
     * @param pageable pagination information
     * @return page of deleted todos
     */
    Page<Todo> findByUserIdAndDeletedAtIsNotNull(Long userId, Pageable pageable);

    /**
     * Find a todo by ID and user ID to validate ownership.
     * 
     * @param id     the ID of the todo
     * @param userId the ID of the user
     * @return optional containing the todo if found and owned by the user
     */
    Optional<Todo> findByIdAndUserId(Long id, Long userId);

    /**
     * Count todos by user ID and status for statistics.
     * 
     * @param userId the ID of the user
     * @param status the status to filter by
     * @return count of todos matching the criteria
     */
    Long countByUserIdAndStatus(Long userId, TodoStatus status);

    /**
     * Count all non-deleted todos by user ID and status.
     * 
     * @param userId the ID of the user
     * @param status the status to filter by
     * @return count of non-deleted todos matching the criteria
     */
    Long countByUserIdAndStatusAndDeletedAtIsNull(Long userId, TodoStatus status);

    /**
     * Find all todos matching a specification with pagination.
     * This method is inherited from JpaSpecificationExecutor and supports dynamic
     * queries.
     * 
     * @param spec     the specification to apply
     * @param pageable pagination information
     * @return page of todos matching the specification
     */
    @Override
    Page<Todo> findAll(Specification<Todo> spec, Pageable pageable);

    /**
     * Find a todo by ID and user ID, only if not deleted.
     * 
     * @param id     the ID of the todo
     * @param userId the ID of the user 
     * @return optional containing the todo if found, owned by user, and not deleted
     */
    Optional<Todo> findByIdAndUserIdAndDeletedAtIsNull(Long id, Long userId);

    /**
     * Count todos by status for admin dashboard
     * 
     * @param status the status to filter by
     * @return count of todos matching the status
     */
    Long countByStatus(TodoStatus status);

    /**
     * Count todos created between dates for admin dashboard
     * 
     * @param start start date
     * @param end   end date
     * @return count of todos created in the date range
     */
    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Count todos completed between dates for admin dashboard
     * 
     * @param start start date
     * @param end   end date
     * @return count of todos completed in the date range
     */
    Long countByCompletedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Count todos by user ID for admin dashboard
     * 
     * @param userId the ID of the user
     * @return count of todos for the user
     */
    Long countByUserId(Long userId);

    /**
     * Find todos by title or description containing search term
     * 
     * @param title       search term for title
     * @param description search term for description
     * @param pageable    pagination information
     * @return page of todos matching the search criteria
     */
    Page<Todo> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title, String description, Pageable pageable);
}
