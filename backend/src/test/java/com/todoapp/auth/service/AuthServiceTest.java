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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests cho AuthService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;
    private RefreshToken refreshToken;

    @BeforeEach
    void setUp() {
        // Setup RegisterRequest
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Test User");

        // Setup LoginRequest
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        // Setup User
        user = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .fullName("Test User")
                .role(Role.USER)
                .emailVerified(false)
                .status(UserStatus.ACTIVE)
                .build();

        // Setup RefreshToken
        refreshToken = RefreshToken.builder()
                .id(1L)
                .token("refresh-token-123")
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
    }

    @Test
    @DisplayName("Test đăng ký thành công")
    void testRegisterSuccess() {
        // Given
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(user.getId())).thenReturn("access-token-123");
        when(refreshTokenService.createRefreshToken(user)).thenReturn(refreshToken);

        // When
        AuthResponse response = authService.register(registerRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access-token-123");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token-123");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getFullName()).isEqualTo("Test User");
        assertThat(response.getRole()).isEqualTo("USER");

        verify(userRepository).existsByEmail(registerRequest.getEmail());
        verify(passwordEncoder).encode(registerRequest.getPassword());
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(user.getId());
        verify(refreshTokenService).createRefreshToken(user);
    }

    @Test
    @DisplayName("Test đăng ký với email đã tồn tại")
    void testRegisterDuplicateEmail() {
        // Given
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Email đã được sử dụng");

        verify(userRepository).existsByEmail(registerRequest.getEmail());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Test đăng nhập thành công")
    void testLoginSuccess() {
        // Given
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user.getId())).thenReturn("access-token-123");
        when(refreshTokenService.createRefreshToken(user)).thenReturn(refreshToken);

        // When
        AuthResponse response = authService.login(loginRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access-token-123");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token-123");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("test@example.com");

        verify(userRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder).matches(loginRequest.getPassword(), user.getPassword());
        verify(jwtService).generateToken(user.getId());
        verify(refreshTokenService).createRefreshToken(user);
    }

    @Test
    @DisplayName("Test đăng nhập với email không tồn tại")
    void testLoginInvalidEmail() {
        // Given
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Email hoặc mật khẩu không đúng");

        verify(userRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("Test đăng nhập với password sai")
    void testLoginInvalidPassword() {
        // Given
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Email hoặc mật khẩu không đúng");

        verify(userRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder).matches(loginRequest.getPassword(), user.getPassword());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    @DisplayName("Test đăng nhập với tài khoản bị khóa")
    void testLoginInactiveUser() {
        // Given
        user.setStatus(UserStatus.INACTIVE);
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Tài khoản đã bị khóa hoặc vô hiệu hóa");

        verify(userRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder).matches(loginRequest.getPassword(), user.getPassword());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    @DisplayName("Test refresh token thành công")
    void testRefreshTokenSuccess() {
        // Given
        String refreshTokenString = "refresh-token-123";
        when(refreshTokenService.validateRefreshToken(refreshTokenString)).thenReturn(refreshToken);
        when(jwtService.generateToken(user.getId())).thenReturn("new-access-token");

        // When
        AuthResponse response = authService.refreshToken(refreshTokenString);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("new-access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token-123");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("test@example.com");

        verify(refreshTokenService).validateRefreshToken(refreshTokenString);
        verify(jwtService).generateToken(user.getId());
    }

    @Test
    @DisplayName("Test refresh token với token không hợp lệ")
    void testRefreshTokenInvalid() {
        // Given
        String refreshTokenString = "invalid-token";
        when(refreshTokenService.validateRefreshToken(refreshTokenString))
                .thenThrow(new BadRequestException("Refresh token không hợp lệ"));

        // When & Then
        assertThatThrownBy(() -> authService.refreshToken(refreshTokenString))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Refresh token không hợp lệ");

        verify(refreshTokenService).validateRefreshToken(refreshTokenString);
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    @DisplayName("Test logout thành công")
    void testLogoutSuccess() {
        // Given
        String refreshTokenString = "refresh-token-123";
        doNothing().when(refreshTokenService).revokeRefreshToken(refreshTokenString);

        // When
        authService.logout(refreshTokenString);

        // Then
        verify(refreshTokenService).revokeRefreshToken(refreshTokenString);
    }

    @Test
    @DisplayName("Test verify email thành công")
    void testVerifyEmailSuccess() {
        // Given
        String token = "1"; // Mock token chứa userId
        user.setEmailVerified(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        // When
        authService.verifyEmail(token);

        // Then
        assertThat(user.getEmailVerified()).isTrue();
        verify(userRepository).findById(1L);
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Test verify email với token không hợp lệ")
    void testVerifyEmailInvalidToken() {
        // Given
        String token = "invalid-token";

        // When & Then
        assertThatThrownBy(() -> authService.verifyEmail(token))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Token xác thực không hợp lệ");

        verify(userRepository, never()).findById(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test verify email với user không tồn tại")
    void testVerifyEmailUserNotFound() {
        // Given
        String token = "999"; // userId không tồn tại
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.verifyEmail(token))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Token xác thực không hợp lệ");

        verify(userRepository).findById(999L);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test verify email đã được verify trước đó")
    void testVerifyEmailAlreadyVerified() {
        // Given
        String token = "1";
        user.setEmailVerified(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // When & Then
        assertThatThrownBy(() -> authService.verifyEmail(token))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Email đã được xác thực trước đó");

        verify(userRepository).findById(1L);
        verify(userRepository, never()).save(any());
    }
}

