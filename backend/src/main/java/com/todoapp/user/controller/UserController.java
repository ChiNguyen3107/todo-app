package com.todoapp.user.controller;

import com.todoapp.user.dto.ChangePasswordRequest;
import com.todoapp.user.dto.UpdateUserRequest;
import com.todoapp.user.dto.UserResponse;
import com.todoapp.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các API liên quan đến User
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * API lấy thông tin user hiện tại
     * 
     * GET /api/users/me
     * 
     * @return UserResponse chứa thông tin user hiện tại
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        log.info("API GET /api/users/me - Lấy thông tin user hiện tại");

        UserResponse response = userService.getCurrentUser();

        log.info("Đã trả về thông tin user: {}", response.getEmail());
        return ResponseEntity.ok(response);
    }

    /**
     * API cập nhật profile của user hiện tại
     * 
     * PUT /api/users/me
     * 
     * @param request UpdateUserRequest chứa thông tin cần cập nhật (fullName)
     * @return UserResponse sau khi cập nhật
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication) {
        log.info("API PUT /api/users/me - Cập nhật profile user: {}", authentication.getName());

        // Lấy user ID từ authentication
        // Trong thực tế, bạn có thể lưu userId trong JWT claims hoặc lấy từ email
        UserResponse currentUser = userService.getCurrentUser();
        UserResponse response = userService.updateProfile(currentUser.getId(), request);

        log.info("Đã cập nhật profile user: {}", response.getEmail());
        return ResponseEntity.ok(response);
    }

    /**
     * API đổi mật khẩu của user hiện tại
     * 
     * PUT /api/users/me/password
     * 
     * @param request ChangePasswordRequest chứa mật khẩu cũ và mật khẩu mới
     * @return Thông báo thành công
     */
    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        log.info("API PUT /api/users/me/password - Đổi mật khẩu user: {}", authentication.getName());

        // Lấy user ID từ authentication
        UserResponse currentUser = userService.getCurrentUser();
        userService.changePassword(currentUser.getId(), request);

        log.info("Đã đổi mật khẩu thành công cho user: {}", authentication.getName());
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
}
