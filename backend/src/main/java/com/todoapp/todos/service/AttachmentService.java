package com.todoapp.todos.service;

import com.todoapp.auth.entity.User;
import com.todoapp.auth.repository.UserRepository;
import com.todoapp.common.exception.BadRequestException;
import com.todoapp.common.exception.ResourceNotFoundException;
import com.todoapp.todos.dto.AttachmentRequest;
import com.todoapp.todos.dto.AttachmentResponse;
import com.todoapp.todos.entity.Attachment;
import com.todoapp.todos.entity.Todo;
import com.todoapp.todos.repository.AttachmentRepository;
import com.todoapp.todos.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    /**
     * Thêm attachment cho một todo (mock upload)
     */
    @Transactional
    public AttachmentResponse addAttachment(Long todoId, AttachmentRequest request) {
        log.debug("Thêm attachment cho todoId: {}", todoId);

        User currentUser = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserIdAndDeletedAtIsNull(todoId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo với ID: " + todoId));

        Attachment attachment = Attachment.builder()
                .todo(todo)
                .fileName(request.getFileName())
                .fileUrl(request.getFileUrl())
                .fileSize(request.getFileSize())
                .build();

        Attachment saved = attachmentRepository.save(attachment);
        log.info("Đã thêm attachment {} cho todo {}", saved.getId(), todoId);
        return toResponse(saved);
    }

    /**
     * Xóa attachment theo ID, validate quyền sở hữu qua todo.owner
     */
    @Transactional
    public void deleteAttachment(Long attachmentId) {
        log.debug("Xóa attachment với ID: {}", attachmentId);

        User currentUser = getCurrentUser();
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy attachment với ID: " + attachmentId));

        Todo todo = attachment.getTodo();
        if (!todo.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xóa attachment này");
        }

        attachmentRepository.delete(attachment);
        log.info("Đã xóa attachment với ID: {}", attachmentId);
    }

    /**
     * Lấy danh sách attachment theo todoId, validate quyền sở hữu
     */
    @Transactional(readOnly = true)
    public List<AttachmentResponse> getAttachmentsByTodoId(Long todoId) {
        log.debug("Lấy danh sách attachments cho todoId: {}", todoId);

        User currentUser = getCurrentUser();
        // Validate quyền sở hữu todo, đảm bảo todo tồn tại và thuộc về user hiện tại
        todoRepository.findByIdAndUserIdAndDeletedAtIsNull(todoId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo với ID: " + todoId));

        return attachmentRepository.findByTodoId(todoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AttachmentResponse toResponse(Attachment attachment) {
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileUrl(attachment.getFileUrl())
                .fileSize(attachment.getFileSize())
                .createdAt(attachment.getCreatedAt())
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Không tìm thấy thông tin xác thực");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với email: " + email));
    }
}


