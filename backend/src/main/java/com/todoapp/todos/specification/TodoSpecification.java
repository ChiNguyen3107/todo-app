package com.todoapp.todos.specification;

import com.todoapp.todos.entity.Tag;
import com.todoapp.todos.entity.Todo;
import com.todoapp.todos.entity.TodoPriority;
import com.todoapp.todos.entity.TodoStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Specification class for building dynamic queries for Todo entity.
 * Provides static methods to create various filter conditions.
 */
public class TodoSpecification {

    /**
     * Filter todos by user ID
     * @param userId The user ID to filter by
     * @return Specification for user ID filter
     */
    public static Specification<Todo> hasUserId(Long userId) {
        return (root, query, criteriaBuilder) -> {
            if (userId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("user").get("id"), userId);
        };
    }

    /**
     * Filter todos by status
     * @param status The todo status to filter by
     * @return Specification for status filter
     */
    public static Specification<Todo> hasStatus(TodoStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    /**
     * Filter todos by priority
     * @param priority The todo priority to filter by
     * @return Specification for priority filter
     */
    public static Specification<Todo> hasPriority(TodoPriority priority) {
        return (root, query, criteriaBuilder) -> {
            if (priority == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("priority"), priority);
        };
    }

    /**
     * Filter todos by category ID
     * @param categoryId The category ID to filter by
     * @return Specification for category filter
     */
    public static Specification<Todo> hasCategoryId(Long categoryId) {
        return (root, query, criteriaBuilder) -> {
            if (categoryId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("category").get("id"), categoryId);
        };
    }

    /**
     * Filter todos by tag IDs (todos that have at least one of the specified tags)
     * @param tagIds List of tag IDs to filter by
     * @return Specification for tags filter
     */
    public static Specification<Todo> hasTagIds(List<Long> tagIds) {
        return (root, query, criteriaBuilder) -> {
            if (tagIds == null || tagIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            
            // Join with tags and check if any tag ID is in the list
            Join<Todo, Tag> tagJoin = root.join("tags", JoinType.INNER);
            
            // Add distinct to avoid duplicate results when a todo has multiple matching tags
            if (query != null) {
                query.distinct(true);
            }
            
            return tagJoin.get("id").in(tagIds);
        };
    }

    /**
     * Filter todos by due date range
     * @param from Start date (inclusive)
     * @param to End date (inclusive)
     * @return Specification for due date range filter
     */
    public static Specification<Todo> dueDateBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, criteriaBuilder) -> {
            if (from == null && to == null) {
                return criteriaBuilder.conjunction();
            }
            
            if (from != null && to != null) {
                return criteriaBuilder.between(root.get("dueDate"), from, to);
            } else if (from != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("dueDate"), from);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("dueDate"), to);
            }
        };
    }

    /**
     * Filter todos by searching in title or description
     * @param query Search query string
     * @return Specification for text search filter
     */
    public static Specification<Todo> titleOrDescriptionContains(String query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (query == null || query.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            
            String searchPattern = "%" + query.trim().toLowerCase() + "%";
            
            return criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern)
            );
        };
    }

    /**
     * Filter to exclude soft-deleted todos
     * @return Specification for non-deleted filter
     */
    public static Specification<Todo> isNotDeleted() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.isNull(root.get("deletedAt"));
    }

    /**
     * Filter to get only soft-deleted todos
     * @return Specification for deleted filter
     */
    public static Specification<Todo> isDeleted() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.isNotNull(root.get("deletedAt"));
    }

    /**
     * Filter todos by parent ID (for subtasks)
     * @param parentId The parent todo ID
     * @return Specification for parent filter
     */
    public static Specification<Todo> hasParentId(Long parentId) {
        return (root, query, criteriaBuilder) -> {
            if (parentId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("parent").get("id"), parentId);
        };
    }

    /**
     * Filter todos that are root todos (not subtasks)
     * @return Specification for root todos filter
     */
    public static Specification<Todo> isRootTodo() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.isNull(root.get("parent"));
    }

    /**
     * Combine multiple specifications with AND logic
     * @param specs Array of specifications to combine
     * @return Combined specification
     */
    @SafeVarargs
    public static Specification<Todo> allOf(Specification<Todo>... specs) {
        Specification<Todo> result = Specification.where(null);
        for (Specification<Todo> spec : specs) {
            if (spec != null) {
                result = result.and(spec);
            }
        }
        return result;
    }
}
