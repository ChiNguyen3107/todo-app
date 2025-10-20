package com.todoapp.todos.mapper;

import com.todoapp.todos.dto.TodoDetailResponse;
import com.todoapp.todos.dto.TodoRequest;
import com.todoapp.todos.dto.TodoResponse;
import com.todoapp.todos.entity.Todo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper để chuyển đổi giữa Todo entity và DTOs
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TodoMapper {

    /**
     * Map TodoRequest sang Todo entity
     * Lưu ý: các trường liên quan user, quan hệ sẽ được xử lý ở service
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "subtasks", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Todo toEntity(TodoRequest request);

    /**
     * Map Todo entity sang TodoResponse cơ bản
     * Bỏ qua collection để tránh lazy loading
     */
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "subtasksCount", expression = "java(todo.getSubtasks() != null ? todo.getSubtasks().size() : 0)")
    @Mapping(target = "attachmentsCount", expression = "java(todo.getAttachments() != null ? todo.getAttachments().size() : 0)")
    @Mapping(target = "parentId", expression = "java(todo.getParent() != null ? todo.getParent().getId() : null)")
    TodoResponse toResponse(Todo todo);

    /**
     * Map Todo entity sang TodoDetailResponse chi tiết
     * Bỏ qua collection để controller/service chủ động gán khi đã fetch
     */
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "subtasks", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "subtasksCount", expression = "java(todo.getSubtasks() != null ? todo.getSubtasks().size() : 0)")
    @Mapping(target = "attachmentsCount", expression = "java(todo.getAttachments() != null ? todo.getAttachments().size() : 0)")
    @Mapping(target = "parentId", expression = "java(todo.getParent() != null ? todo.getParent().getId() : null)")
    TodoDetailResponse toDetailResponse(Todo todo);
}


