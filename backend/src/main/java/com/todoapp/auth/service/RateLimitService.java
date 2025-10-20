package com.todoapp.auth.service;

import com.todoapp.common.exception.RateLimitExceededException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service xử lý rate limiting cho các endpoints authentication.
 * Sử dụng Bucket4j để giới hạn số lượng request theo IP address.
 */
@Service
@Slf4j
public class RateLimitService {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    @Value("${rate-limit.auth.capacity:10}")
    private int capacity;
    
    @Value("${rate-limit.auth.refill-tokens:10}")
    private int refillTokens;
    
    @Value("${rate-limit.auth.refill-duration-minutes:10}")
    private int refillDurationMinutes;

    /**
     * Tạo bucket mới với cấu hình từ application.yml
     */
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.builder()
            .capacity(capacity)
            .refillIntervally(refillTokens, Duration.ofMinutes(refillDurationMinutes))
            .build();
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }

    /**
     * Lấy bucket cho IP address. Tạo mới nếu chưa tồn tại.
     */
    private Bucket resolveBucket(String ipAddress) {
        return cache.computeIfAbsent(ipAddress, k -> createNewBucket());
    }

    /**
     * Kiểm tra và tiêu thụ 1 token. Throw exception nếu không đủ token.
     * 
     * @param ipAddress IP address của client
     * @throws RateLimitExceededException nếu vượt quá giới hạn
     */
    public void checkRateLimit(String ipAddress) {
        Bucket bucket = resolveBucket(ipAddress);
        
        var probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            // Token còn, request được phép
            log.debug("Rate limit OK cho IP: {} - Tokens còn lại: {}", 
                ipAddress, probe.getRemainingTokens());
        } else {
            // Hết token, reject request
            long waitTime = probe.getNanosToWaitForRefill() / 1_000_000_000;
            log.warn("Rate limit exceeded cho IP: {} - Phải đợi {} giây", ipAddress, waitTime);
            throw new RateLimitExceededException(waitTime);
        }
    }

    /**
     * Kiểm tra mà không tiêu thụ token (để test)
     */
    public boolean isAllowed(String ipAddress) {
        Bucket bucket = resolveBucket(ipAddress);
        return bucket.getAvailableTokens() > 0;
    }

    /**
     * Lấy số tokens còn lại cho IP address
     */
    public long getAvailableTokens(String ipAddress) {
        Bucket bucket = resolveBucket(ipAddress);
        return bucket.getAvailableTokens();
    }

    /**
     * Reset rate limit cho IP address (để test hoặc admin)
     */
    public void resetRateLimit(String ipAddress) {
        cache.remove(ipAddress);
        log.info("Đã reset rate limit cho IP: {}", ipAddress);
    }

    /**
     * Xóa cache cho các IP không còn sử dụng (cleanup)
     */
    public void cleanupCache() {
        int sizeBefore = cache.size();
        cache.entrySet().removeIf(entry -> entry.getValue().getAvailableTokens() >= capacity);
        int sizeAfter = cache.size();
        log.info("Cleanup rate limit cache: {} -> {} entries", sizeBefore, sizeAfter);
    }
}
