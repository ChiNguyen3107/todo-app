package com.todoapp.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception ném ra khi vượt quá giới hạn số lượng request (rate limit).
 * Trả về HTTP 429 Too Many Requests.
 */
@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
public class RateLimitExceededException extends RuntimeException {
    
    public RateLimitExceededException() {
        super("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }
    
    public RateLimitExceededException(String message) {
        super(message);
    }
    
    public RateLimitExceededException(long waitTimeSeconds) {
        super(String.format("Quá nhiều yêu cầu. Vui lòng thử lại sau %d giây.", waitTimeSeconds));
    }
}
