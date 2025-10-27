package com.todoapp.todos.repository;

import com.todoapp.todos.entity.Todo;
import com.todoapp.todos.entity.TodoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
     * Note: This also includes todos with deleted_at = '0000-00-00 00:00:00' from old database exports
     * 
     * @param userId   the ID of the user
     * @param pageable pagination information
     * @return page of todos that are not deleted
     */
    Page<Todo> findByUserIdAndDeletedAtIsNull(Long userId, Pageable pageable);
    
    /**
     * Find all active todos for a user with smart ordering
     * Orders by: IN_PROGRESS (first), PENDING, DONE (last), then due_date, then updated_at
     * 
     * @param userId   the ID of the user
     * @param pageable pagination information
     * @return page of todos that are not deleted, ordered intelligently
     */
    @Query(value = "SELECT * FROM todos " +
           "WHERE user_id = :userId AND deleted_at IS NULL " +
           "ORDER BY " +
           "CASE WHEN status='IN_PROGRESS' THEN 0 WHEN status='PENDING' THEN 1 ELSE 2 END, " +
           "COALESCE(due_date, '2999-12-31 23:59:59'), " +
           "updated_at DESC", 
           countQuery = "SELECT count(*) FROM todos WHERE user_id = :userId AND deleted_at IS NULL",
           nativeQuery = true)
    Page<Todo> findActiveTodosByUserId(@Param("userId") Long userId, Pageable pageable);

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
     * Count todos by user ID for admin dashboard
     * 
     * @param userId the ID of the user
     * @return count of todos for the user
     */
    Long countByUserId(Long userId);

    /**
     * Find todos by title or description containing search term
     * 
     * @param search   search term for title or description
     * @param pageable pagination information
     * @return page of todos matching the search criteria
     */
    @Query("SELECT t FROM Todo t WHERE " +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Todo> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String search, Pageable pageable);

    /**
     * Find all todos with eager loading of related entities for admin management
     * 
     * @param pageable pagination information
     * @return page of todos with all related entities loaded
     */
    @Query("SELECT DISTINCT t FROM Todo t " +
           "LEFT JOIN FETCH t.user " +
           "LEFT JOIN FETCH t.category " +
           "LEFT JOIN FETCH t.parent " +
           "LEFT JOIN FETCH t.subtasks " +
           "LEFT JOIN FETCH t.attachments " +
           "LEFT JOIN FETCH t.tags")
    Page<Todo> findAllWithRelations(Pageable pageable);

    /**
     * Find todos by title or description containing search term with eager loading
     * 
     * @param search   search term for title or description
     * @param pageable pagination information
     * @return page of todos matching the search criteria with all related entities loaded
     */
    @Query("SELECT DISTINCT t FROM Todo t " +
           "LEFT JOIN FETCH t.user " +
           "LEFT JOIN FETCH t.category " +
           "LEFT JOIN FETCH t.parent " +
           "LEFT JOIN FETCH t.subtasks " +
           "LEFT JOIN FETCH t.attachments " +
           "LEFT JOIN FETCH t.tags " +
           "WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Todo> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseWithRelations(
            String search, Pageable pageable);
}
