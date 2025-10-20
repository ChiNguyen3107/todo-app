package com.todoapp.auth.service;

import com.todoapp.auth.entity.RefreshToken;
import com.todoapp.auth.entity.User;
import com.todoapp.auth.repository.RefreshTokenRepository;
import com.todoapp.common.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration-minutes}")
    private Integer refreshExpirationMinutes;

    /**
     * Tạo refresh token mới cho user
     *
     * @param user User cần tạo refresh token
     * @return RefreshToken entity đã được lưu vào database
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        log.debug("Creating refresh token for user: {}", user.getEmail());

        // Tạo token string ngẫu nhiên bằng UUID
        String tokenString = UUID.randomUUID().toString();

        // Tính thời gian hết hạn
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(refreshExpirationMinutes);

        // Tạo refresh token entity
        RefreshToken refreshToken = RefreshToken.builder()
                .token(tokenString)
                .user(user)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();

        // Lưu vào database
        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.info("Created refresh token for user: {} (expires at: {})", user.getEmail(), expiresAt);

        return savedToken;
    }

    /**
     * Validate refresh token
     * Kiểm tra:
     * - Token có tồn tại không
     * - Token đã bị revoke chưa
     * - Token đã hết hạn chưa
     *
     * @param token Token string cần validate
     * @return RefreshToken entity nếu hợp lệ
     * @throws BadRequestException nếu token không hợp lệ
     */
    @Transactional(readOnly = true)
    public RefreshToken validateRefreshToken(String token) {
        log.debug("Validating refresh token");

        // Tìm token trong database
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    log.warn("Refresh token not found");
                    return new BadRequestException("Refresh token không hợp lệ");
                });

        // Kiểm tra token đã bị revoke chưa
        if (refreshToken.getRevoked()) {
            log.warn("Refresh token has been revoked: {}", token);
            throw new BadRequestException("Refresh token đã bị thu hồi");
        }

        // Kiểm tra token đã hết hạn chưa
        if (refreshToken.isExpired()) {
            log.warn("Refresh token has expired: {} (expired at: {})", token, refreshToken.getExpiresAt());
            throw new BadRequestException("Refresh token đã hết hạn");
        }

        log.debug("Refresh token is valid for user: {}", refreshToken.getUser().getEmail());
        return refreshToken;
    }

    /**
     * Revoke refresh token (đánh dấu là đã thu hồi)
     * Sử dụng khi logout hoặc khi phát hiện token bị xâm phạm
     *
     * @param token Token string cần revoke
     */
    @Transactional
    public void revokeRefreshToken(String token) {
        log.debug("Revoking refresh token");

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    log.warn("Refresh token not found for revocation");
                    return new BadRequestException("Refresh token không tồn tại");
                });

        // Đánh dấu token là revoked
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        log.info("Revoked refresh token for user: {}", refreshToken.getUser().getEmail());
    }

    /**
     * Revoke tất cả refresh tokens của một user
     * Sử dụng khi user đổi password hoặc yêu cầu logout khỏi tất cả devices
     *
     * @param user User cần revoke tất cả tokens
     */
    @Transactional
    public void revokeAllUserRefreshTokens(User user) {
        log.debug("Revoking all refresh tokens for user: {}", user.getEmail());
        refreshTokenRepository.deleteByUser(user);
        log.info("Revoked all refresh tokens for user: {}", user.getEmail());
    }

    /**
     * Xóa tất cả các refresh tokens đã hết hạn
     * Method này sẽ được scheduled chạy định kỳ để cleanup database
     * Chạy mỗi ngày lúc 2h sáng
     */
    @Transactional
    @Scheduled(cron = "0 0 2 * * ?") // Chạy lúc 2h sáng mỗi ngày
    public void cleanupExpiredTokens() {
        log.info("Starting cleanup of expired refresh tokens");

        try {
            LocalDateTime now = LocalDateTime.now();
            refreshTokenRepository.deleteAllExpiredTokens(now);
            log.info("Successfully cleaned up expired refresh tokens");
        } catch (Exception e) {
            log.error("Error during cleanup of expired refresh tokens", e);
        }
    }

    /**
     * Cleanup thủ công - có thể gọi từ admin endpoint nếu cần
     */
    @Transactional
    public void manualCleanupExpiredTokens() {
        log.info("Manual cleanup of expired refresh tokens triggered");
        cleanupExpiredTokens();
    }

    /**
     * Lấy refresh token entity từ token string
     *
     * @param token Token string
     * @return RefreshToken entity (không validate)
     */
    @Transactional(readOnly = true)
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Refresh token không tồn tại"));
    }

    /**
     * Kiểm tra token có hết hạn không
     *
     * @param refreshToken RefreshToken entity
     * @return true nếu đã hết hạn
     */
    public boolean isTokenExpired(RefreshToken refreshToken) {
        return refreshToken.isExpired();
    }

    /**
     * Kiểm tra token có bị revoke không
     *
     * @param refreshToken RefreshToken entity
     * @return true nếu đã bị revoke
     */
    public boolean isTokenRevoked(RefreshToken refreshToken) {
        return refreshToken.getRevoked();
    }
}
