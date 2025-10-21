package com.todoapp.auth.repository;

import com.todoapp.auth.entity.User;
import com.todoapp.auth.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Long countByStatus(UserStatus status);

    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(
            String search, Pageable pageable);
}
