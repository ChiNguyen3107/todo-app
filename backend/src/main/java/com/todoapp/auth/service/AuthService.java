package com.todoapp.auth.service;

import com.todoapp.auth.dto.AuthResponse;
import com.todoapp.auth.dto.LoginRequest;
import com.todoapp.auth.dto.RegisterRequest;
import com.todoapp.auth.entity.RefreshToken;
import com.todoapp.auth.entity.Role;
import com.todoapp.auth.entity.User;
import com.todoapp.auth.entity.UserStatus;
import com.todoapp.auth.repository.UserRepository;
import com.todoapp.auth.security.JwtService;
import com.todoapp.common.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Đăng ký user mới
     *
     * @param request RegisterRequest chứa thông tin đăng ký
     * @return AuthResponse chứa access token và refresh token
     * @throws BadRequestException nếu email đã tồn tại
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing registration for email: {}", request.getEmail());

        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already exists - {}", request.getEmail());
            throw new BadRequestException("Email đã được sử dụng");
        }

        // Mã hóa password bằng BCrypt
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Tạo user mới
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .fullName(request.getFullName())
                .role(Role.USER)
                .emailVerified(false)
                .status(UserStatus.ACTIVE)
                .build();

        // Lưu user vào database
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {} (ID: {})", savedUser.getEmail(), savedUser.getId());

        // Tạo tokens
        String accessToken = jwtService.generateToken(savedUser.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser);

        // Trả về response
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole().name())
                .build();
    }

    /**
     * Đăng nhập
     *
     * @param request LoginRequest chứa email và password
     * @return AuthResponse chứa access token và refresh token
     * @throws BadRequestException nếu credentials không đúng
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login for email: {}", request.getEmail());

        // Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found - {}", request.getEmail());
                    return new BadRequestException("Email hoặc mật khẩu không đúng");
                });

        // Kiểm tra password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: Invalid password for user - {}", request.getEmail());
            throw new BadRequestException("Email hoặc mật khẩu không đúng");
        }

        // Kiểm tra trạng thái user
        if (user.getStatus() != UserStatus.ACTIVE) {
            log.warn("Login failed: User is not active - {}", request.getEmail());
            throw new BadRequestException("Tài khoản đã bị khóa hoặc vô hiệu hóa");
        }

        log.info("User logged in successfully: {} (ID: {})", user.getEmail(), user.getId());

        // Tạo tokens
        String accessToken = jwtService.generateToken(user.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        // Trả về response
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    /**
     * Refresh access token
     *
     * @param refreshTokenString Refresh token string
     * @return AuthResponse chứa access token mới và refresh token cũ
     * @throws BadRequestException nếu refresh token không hợp lệ
     */
    @Transactional
    public AuthResponse refreshToken(String refreshTokenString) {
        log.info("Processing token refresh");

        // Validate refresh token
        RefreshToken refreshToken = refreshTokenService.validateRefreshToken(refreshTokenString);

        User user = refreshToken.getUser();
        log.info("Refreshing token for user: {} (ID: {})", user.getEmail(), user.getId());

        // Tạo access token mới
        String newAccessToken = jwtService.generateToken(user.getId());

        // Trả về response với access token mới
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    /**
     * Đăng xuất
     *
     * @param refreshTokenString Refresh token cần revoke
     * @throws BadRequestException nếu refresh token không hợp lệ
     */
    @Transactional
    public void logout(String refreshTokenString) {
        log.info("Processing logout");

        // Revoke refresh token
        refreshTokenService.revokeRefreshToken(refreshTokenString);

        log.info("User logged out successfully");
    }

    /**
     * Xác thực email (mock implementation)
     *
     * @param token Token xác thực email
     * @throws BadRequestException nếu token không hợp lệ hoặc user không tồn tại
     */
    @Transactional
    public void verifyEmail(String token) {
        log.info("Processing email verification with token: {}", token);

        // Mock implementation: giả sử token chứa userId
        // Trong thực tế, bạn nên tạo một bảng email_verification_tokens riêng
        // và lưu trữ token với expiration time

        try {
            // Parse userId từ token (mock - trong thực tế nên dùng cách an toàn hơn)
            Long userId = Long.parseLong(token);

            // Tìm user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        log.warn("Email verification failed: User not found with ID: {}", userId);
                        return new BadRequestException("Token xác thực không hợp lệ");
                    });

            // Kiểm tra đã verify chưa
            if (user.getEmailVerified()) {
                log.warn("Email already verified for user: {}", user.getEmail());
                throw new BadRequestException("Email đã được xác thực trước đó");
            }

            // Cập nhật emailVerified = true
            user.setEmailVerified(true);
            userRepository.save(user);

            log.info("Email verified successfully for user: {} (ID: {})", user.getEmail(), user.getId());
        } catch (NumberFormatException e) {
            log.error("Invalid token format: {}", token);
            throw new BadRequestException("Token xác thực không hợp lệ");
        }
    }
}
