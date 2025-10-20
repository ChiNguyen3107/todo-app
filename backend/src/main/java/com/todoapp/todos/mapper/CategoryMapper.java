package com.todoapp.todos.mapper;

import com.todoapp.todos.dto.CategoryRequest;
import com.todoapp.todos.dto.CategoryResponse;
import com.todoapp.todos.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper để chuyển đổi giữa Category entity và DTOs
 */
@Mapper(componentModel = "spring")
public interface CategoryMapper {

    /**
     * Chuyển đổi CategoryRequest thành Category entity
     * Lưu ý: User sẽ được set trong service layer
     * 
     * @param request CategoryRequest
     * @return Category entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Category toEntity(CategoryRequest request);

    /**
     * Chuyển đổi Category entity thành CategoryResponse
     * 
     * @param category Category entity
     * @return CategoryResponse
     */
    CategoryResponse toResponse(Category category);

    /**
     * Chuyển đổi danh sách Category entity thành danh sách CategoryResponse
     * 
     * @param categories List của Category entity
     * @return List của CategoryResponse
     */
    List<CategoryResponse> toResponseList(List<Category> categories);
}
