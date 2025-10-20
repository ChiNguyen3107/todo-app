package com.todoapp.auth.controller;

import com.todoapp.auth.dto.AuthResponse;
import com.todoapp.auth.dto.LoginRequest;
import com.todoapp.auth.dto.RefreshTokenRequest;
import com.todoapp.auth.dto.RegisterRequest;
import com.todoapp.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller xử lý các API liên quan đến authentication
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint đăng ký user mới
     *
     * @param request RegisterRequest chứa email, password, fullName
     * @return AuthResponse chứa access token và refresh token
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register - Đăng ký user mới: {}", request.getEmail());

        AuthResponse response = authService.register(request);

        log.info("User đăng ký thành công: {} (ID: {})", request.getEmail(), response.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint đăng nhập
     *
     * @param request LoginRequest chứa email và password
     * @return AuthResponse chứa access token và refresh token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/auth/login - Đăng nhập: {}", request.getEmail());

        AuthResponse response = authService.login(request);

        log.info("User đăng nhập thành công: {} (ID: {})", request.getEmail(), response.getUserId());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint refresh access token
     *
     * @param request RefreshTokenRequest chứa refresh token
     * @return AuthResponse chứa access token mới và refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("POST /api/auth/refresh - Refresh access token");

        AuthResponse response = authService.refreshToken(request.getRefreshToken());

        log.info("Access token được refresh thành công cho user ID: {}", response.getUserId());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint đăng xuất
     *
     * @param request RefreshTokenRequest chứa refresh token cần revoke
     * @return Message xác nhận đăng xuất thành công
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("POST /api/auth/logout - Đăng xuất user");

        authService.logout(request.getRefreshToken());

        log.info("User đăng xuất thành công");

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đăng xuất thành công");
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint xác thực email (mock implementation)
     *
     * @param token Token xác thực email (trong request param)
     * @return Message xác nhận email đã được verify
     */
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam("token") String token) {
        log.info("POST /api/auth/verify-email - Xác thực email với token: {}", token);

        authService.verifyEmail(token);

        log.info("Email được xác thực thành công với token: {}", token);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Email đã được xác thực thành công");
        return ResponseEntity.ok(response);
    }
}
