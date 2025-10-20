package com.todoapp.todos.entity;

import com.todoapp.common.entity.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attachments", indexes = {
        @Index(name = "idx_attachment_todo_id", columnList = "todo_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "todo_id", nullable = false)
    private Todo todo;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    @Column(name = "file_size")
    private Long fileSize;
}
