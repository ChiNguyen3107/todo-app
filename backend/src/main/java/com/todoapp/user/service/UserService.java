package com.todoapp.user.service;

import com.todoapp.auth.entity.Role;
import com.todoapp.auth.entity.User;
import com.todoapp.auth.repository.UserRepository;
import com.todoapp.common.exception.BadRequestException;
import com.todoapp.common.exception.ResourceNotFoundException;
import com.todoapp.user.dto.ChangePasswordRequest;
import com.todoapp.user.dto.UpdateUserRequest;
import com.todoapp.user.dto.UserResponse;
import com.todoapp.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service xử lý các nghiệp vụ liên quan đến User
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lấy thông tin user theo ID
     *
     * @param id ID của user
     * @return UserResponse
     * @throws ResourceNotFoundException nếu không tìm thấy user
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        log.debug("Lấy thông tin user với ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với ID: " + id));
        
        log.info("Đã lấy thông tin user với ID: {}", id);
        return userMapper.toResponse(user);
    }

    /**
     * Lấy thông tin user hiện tại từ SecurityContext
     *
     * @return UserResponse
     * @throws ResourceNotFoundException nếu không tìm thấy user
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        log.debug("Lấy thông tin user hiện tại từ SecurityContext");
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Không tìm thấy thông tin xác thực");
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với email: " + email));
        
        log.info("Đã lấy thông tin user hiện tại: {}", email);
        return userMapper.toResponse(user);
    }

    /**
     * Cập nhật thông tin profile của user (fullName)
     *
     * @param id ID của user cần cập nhật
     * @param request UpdateUserRequest chứa thông tin cần cập nhật
     * @return UserResponse sau khi cập nhật
     * @throws ResourceNotFoundException nếu không tìm thấy user
     * @throws AccessDeniedException nếu user không có quyền cập nhật
     */
    @Transactional
    public UserResponse updateProfile(Long id, UpdateUserRequest request) {
        log.debug("Cập nhật profile cho user với ID: {}", id);
        
        // Lấy user cần cập nhật
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với ID: " + id));
        
        // Validate quyền: user chỉ có thể update chính mình (trừ ADMIN)
        validateUserPermission(user);
        
        // Cập nhật thông tin
        user.setFullName(request.getFullName());
        
        User updatedUser = userRepository.save(user);
        log.info("Đã cập nhật profile cho user với ID: {}", id);
        
        return userMapper.toResponse(updatedUser);
    }

    /**
     * Đổi mật khẩu của user
     *
     * @param id ID của user cần đổi mật khẩu
     * @param request ChangePasswordRequest chứa mật khẩu cũ và mật khẩu mới
     * @throws ResourceNotFoundException nếu không tìm thấy user
     * @throws BadRequestException nếu mật khẩu cũ không đúng
     * @throws AccessDeniedException nếu user không có quyền đổi mật khẩu
     */
    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        log.debug("Đổi mật khẩu cho user với ID: {}", id);
        
        // Lấy user cần đổi mật khẩu
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với ID: " + id));
        
        // Validate quyền: user chỉ có thể đổi mật khẩu chính mình (trừ ADMIN)
        validateUserPermission(user);
        
        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            log.warn("Mật khẩu cũ không đúng cho user với ID: {}", id);
            throw new BadRequestException("Mật khẩu cũ không đúng");
        }
        
        // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            log.warn("Mật khẩu mới trùng với mật khẩu cũ cho user với ID: {}", id);
            throw new BadRequestException("Mật khẩu mới phải khác mật khẩu cũ");
        }
        
        // Mã hóa và cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        log.info("Đã đổi mật khẩu thành công cho user với ID: {}", id);
    }

    /**
     * Validate quyền truy cập: user chỉ có thể thao tác trên chính mình (trừ ADMIN)
     *
     * @param targetUser User đích cần thao tác
     * @throws AccessDeniedException nếu không có quyền
     */
    private void validateUserPermission(User targetUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Không tìm thấy thông tin xác thực");
        }
        
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user hiện tại"));
        
        // ADMIN có thể thao tác trên bất kỳ user nào
        if (currentUser.getRole() == Role.ADMIN) {
            log.debug("User hiện tại là ADMIN, có quyền thao tác");
            return;
        }
        
        // User thường chỉ có thể thao tác trên chính mình
        if (!currentUser.getId().equals(targetUser.getId())) {
            log.warn("User {} cố gắng thao tác trên user {}", currentUser.getId(), targetUser.getId());
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này");
        }
        
        log.debug("User có quyền thao tác trên chính mình");
    }
}
