package com.todoapp.common.config;

import com.todoapp.auth.config.RateLimitInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình Spring MVC, đăng ký các interceptors.
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final RateLimitInterceptor rateLimitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Áp dụng rate limit cho các endpoints authentication
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns(
                    "/api/auth/register",
                    "/api/auth/login", 
                    "/api/auth/refresh"
                );
    }
}
