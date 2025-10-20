package com.todoapp.common.config;

import com.todoapp.auth.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
public class AuditorAwareConfig {

    @Bean
    public AuditorAware<Long> auditorAware() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || 
                !authentication.isAuthenticated() || 
                authentication instanceof AnonymousAuthenticationToken) {
                return Optional.empty();
            }
            
            try {
                return Optional.of(Long.parseLong(authentication.getName()));
            } catch (NumberFormatException e) {
                return Optional.empty();
            }
        };
    }
}
