package com.todoapp.user.mapper;

import com.todoapp.auth.entity.User;
import com.todoapp.user.dto.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper để chuyển đổi giữa User entity và UserResponse DTO
 * Sử dụng MapStruct với componentModel = "spring" để tích hợp với Spring
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Chuyển đổi User entity sang UserResponse DTO
     * 
     * @param user User entity
     * @return UserResponse DTO
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "emailVerified", source = "emailVerified")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdAt", source = "createdAt")
    UserResponse toResponse(User user);
}
