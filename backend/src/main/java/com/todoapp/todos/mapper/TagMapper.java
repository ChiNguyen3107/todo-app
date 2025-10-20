package com.todoapp.todos.mapper;

import com.todoapp.todos.dto.TagRequest;
import com.todoapp.todos.dto.TagResponse;
import com.todoapp.todos.entity.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper để chuyển đổi giữa Tag entity và DTOs
 */
@Mapper(componentModel = "spring")
public interface TagMapper {

    /**
     * Chuyển đổi TagRequest thành Tag entity
     * Lưu ý: User sẽ được set trong service layer
     * 
     * @param request TagRequest
     * @return Tag entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Tag toEntity(TagRequest request);

    /**
     * Chuyển đổi Tag entity thành TagResponse
     * 
     * @param tag Tag entity
     * @return TagResponse
     */
    TagResponse toResponse(Tag tag);

    /**
     * Chuyển đổi danh sách Tag entity thành danh sách TagResponse
     * 
     * @param tags List của Tag entity
     * @return List của TagResponse
     */
    List<TagResponse> toResponseList(List<Tag> tags);
}
