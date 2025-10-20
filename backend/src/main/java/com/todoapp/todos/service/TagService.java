package com.todoapp.todos.service;

import com.todoapp.auth.entity.User;
import com.todoapp.auth.repository.UserRepository;
import com.todoapp.common.exception.BadRequestException;
import com.todoapp.common.exception.ResourceNotFoundException;
import com.todoapp.todos.dto.TagRequest;
import com.todoapp.todos.dto.TagResponse;
import com.todoapp.todos.entity.Tag;
import com.todoapp.todos.mapper.TagMapper;
import com.todoapp.todos.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service xử lý các nghiệp vụ liên quan đến Tag
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final TagMapper tagMapper;

    /**
     * Tạo tag mới cho user hiện tại
     *
     * @param request TagRequest chứa thông tin tag
     * @return TagResponse sau khi tạo
     * @throws BadRequestException nếu tag đã tồn tại
     */
    @Transactional
    public TagResponse create(TagRequest request) {
        log.debug("Tạo tag mới với tên: {}", request.getName());

        // Lấy user hiện tại
        User currentUser = getCurrentUser();

        // Kiểm tra trùng tên tag
        tagRepository.findByUserIdAndName(currentUser.getId(), request.getName())
                .ifPresent(existingTag -> {
                    throw new BadRequestException("Tag với tên '" + request.getName() + "' đã tồn tại");
                });

        // Tạo tag mới
        Tag tag = tagMapper.toEntity(request);
        tag.setUser(currentUser);

        Tag savedTag = tagRepository.save(tag);
        log.info("Đã tạo tag mới với ID: {} cho user: {}", savedTag.getId(), currentUser.getEmail());

        return tagMapper.toResponse(savedTag);
    }

    /**
     * Cập nhật tag
     *
     * @param id      ID của tag cần cập nhật
     * @param request TagRequest chứa thông tin cập nhật
     * @return TagResponse sau khi cập nhật
     * @throws ResourceNotFoundException nếu không tìm thấy tag
     * @throws AccessDeniedException     nếu user không sở hữu tag
     * @throws BadRequestException       nếu tên tag mới bị trùng
     */
    @Transactional
    public TagResponse update(Long id, TagRequest request) {
        log.debug("Cập nhật tag với ID: {}", id);

        // Lấy user hiện tại
        User currentUser = getCurrentUser();

        // Tìm tag và validate ownership
        Tag tag = tagRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag với ID: " + id));

        // Kiểm tra trùng tên nếu thay đổi tên
        if (!tag.getName().equals(request.getName())) {
            tagRepository.findByUserIdAndName(currentUser.getId(), request.getName())
                    .ifPresent(existingTag -> {
                        throw new BadRequestException("Tag với tên '" + request.getName() + "' đã tồn tại");
                    });
        }

        // Cập nhật thông tin
        tag.setName(request.getName());
        tag.setColor(request.getColor());

        Tag updatedTag = tagRepository.save(tag);
        log.info("Đã cập nhật tag với ID: {}", id);

        return tagMapper.toResponse(updatedTag);
    }

    /**
     * Xóa tag
     *
     * @param id ID của tag cần xóa
     * @throws ResourceNotFoundException nếu không tìm thấy tag
     * @throws AccessDeniedException     nếu user không sở hữu tag
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Xóa tag với ID: {}", id);

        // Lấy user hiện tại
        User currentUser = getCurrentUser();

        // Tìm tag và validate ownership
        Tag tag = tagRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag với ID: " + id));

        tagRepository.delete(tag);
        log.info("Đã xóa tag với ID: {}", id);
    }

    /**
     * Lấy tất cả tags của user hiện tại
     *
     * @return Danh sách TagResponse
     */
    @Transactional(readOnly = true)
    public List<TagResponse> getAll() {
        log.debug("Lấy danh sách tất cả tags");

        // Lấy user hiện tại
        User currentUser = getCurrentUser();

        List<Tag> tags = tagRepository.findByUserId(currentUser.getId());
        log.info("Đã lấy {} tags cho user: {}", tags.size(), currentUser.getEmail());

        return tagMapper.toResponseList(tags);
    }

    /**
     * Lấy tag theo ID
     *
     * @param id ID của tag
     * @return TagResponse
     * @throws ResourceNotFoundException nếu không tìm thấy tag
     * @throws AccessDeniedException     nếu user không sở hữu tag
     */
    @Transactional(readOnly = true)
    public TagResponse getById(Long id) {
        log.debug("Lấy tag với ID: {}", id);

        // Lấy user hiện tại
        User currentUser = getCurrentUser();

        // Tìm tag và validate ownership
        Tag tag = tagRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag với ID: " + id));

        log.info("Đã lấy tag với ID: {}", id);
        return tagMapper.toResponse(tag);
    }

    /**
     * Lấy user hiện tại từ SecurityContext
     *
     * @return User entity
     * @throws BadRequestException       nếu không tìm thấy authentication
     * @throws ResourceNotFoundException nếu không tìm thấy user
     */
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
