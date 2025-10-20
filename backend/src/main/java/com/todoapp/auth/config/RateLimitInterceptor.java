package com.todoapp.auth.config;

import com.todoapp.auth.service.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor áp dụng rate limiting cho các endpoints authentication.
 * Chỉ áp dụng cho /api/auth/register, /api/auth/login, /api/auth/refresh
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String ipAddress = getClientIpAddress(request);
        
        log.debug("Kiểm tra rate limit cho IP: {} - Endpoint: {}", ipAddress, request.getRequestURI());
        
        // RateLimitService sẽ throw RateLimitExceededException nếu vượt giới hạn
        rateLimitService.checkRateLimit(ipAddress);
        
        return true;
    }

    /**
     * Lấy IP address của client, xử lý trường hợp có proxy/load balancer
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // X-Forwarded-For có thể chứa nhiều IP, lấy IP đầu tiên
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
