package com.todoapp.todos.entity;

import com.todoapp.auth.entity.User;
import com.todoapp.common.entity.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories", indexes = {
                @Index(name = "idx_user_id", columnList = "user_id")
}, uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_name", columnNames = { "user_id", "name" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends Auditable {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @Column(nullable = false, length = 100)
        private String name;

        @Column(length = 7)
        private String color;

        @Column(name = "order_index")
        private Integer orderIndex;
}
