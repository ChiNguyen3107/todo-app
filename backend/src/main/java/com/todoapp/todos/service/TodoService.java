package com.todoapp.todos.service;

import com.todoapp.auth.entity.User;
import com.todoapp.auth.repository.UserRepository;
import com.todoapp.common.exception.BadRequestException;
import com.todoapp.common.exception.ResourceNotFoundException;
import com.todoapp.todos.dto.*;
import com.todoapp.todos.entity.Category;
import com.todoapp.todos.entity.Tag;
import com.todoapp.todos.entity.Todo;
import com.todoapp.todos.entity.TodoStatus;
import com.todoapp.todos.mapper.CategoryMapper;
import com.todoapp.todos.mapper.TagMapper;
import com.todoapp.todos.mapper.TodoMapper;
import com.todoapp.todos.repository.CategoryRepository;
import com.todoapp.todos.repository.TagRepository;
import com.todoapp.todos.repository.TodoRepository;
import com.todoapp.todos.specification.TodoSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service xử lý các nghiệp vụ liên quan đến Todo
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TodoService {

    private final TodoRepository todoRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final TodoMapper todoMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;

    /**
     * Tạo todo mới cho user hiện tại
     *
     * @param request TodoRequest chứa thông tin todo
     * @return TodoResponse sau khi tạo
     */
    @Transactional
    public TodoResponse create(TodoRequest request) {
        log.debug("Tạo todo mới với title: {}", request.getTitle());

        User currentUser = getCurrentUser();
        Todo todo = todoMapper.toEntity(request);
        todo.setUser(currentUser);

        // Set category nếu có
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy category với ID: " + request.getCategoryId()));
            todo.setCategory(category);
        }

        // Set tags nếu có
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUserId(tagId, currentUser.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag với ID: " + tagId));
                tags.add(tag);
            }
            todo.setTags(tags);
        }

        todo.setCreatedBy(currentUser.getId());
        todo.setUpdatedBy(currentUser.getId());

        Todo savedTodo = todoRepository.save(todo);
        log.info("Đã tạo todo mới với ID: {}", savedTodo.getId());

        return mapToResponse(savedTodo);
    }

    /**
     * Cập nhật todo (validate ownership)
     *
     * @param id      ID của todo cần cập nhật
     * @param request TodoRequest chứa thông tin cập nhật
     * @return TodoResponse sau khi cập nhật
     */
    @Transactional
    public TodoResponse update(Long id, TodoRequest request) {
        log.debug("Cập nhật todo với ID: {}", id);

        User currentUser = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserIdAndDeletedAtIsNull(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo với ID: " + id));

        // Cập nhật thông tin cơ bản
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setStatus(request.getStatus());
        todo.setPriority(request.getPriority());
        
        // Chỉ update due_date nếu được cung cấp trong request
        if (request.getDueDate() != null) {
            todo.setDueDate(request.getDueDate());
        }
        
        // Chỉ update remind_at nếu được cung cấp
        if (request.getRemindAt() != null) {
            todo.setRemindAt(request.getRemindAt());
        }
        
        // Chỉ update estimated_minutes nếu được cung cấp
        if (request.getEstimatedMinutes() != null) {
            todo.setEstimatedMinutes(request.getEstimatedMinutes());
        }

        // Cập nhật category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy category với ID: " + request.getCategoryId()));
            todo.setCategory(category);
        } else {
            todo.setCategory(null);
        }

        // Cập nhật tags
        todo.getTags().clear();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUserId(tagId, currentUser.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag với ID: " + tagId));
                tags.add(tag);
            }
            todo.setTags(tags);
        }

        todo.setUpdatedBy(currentUser.getId());

        Todo updatedTodo = todoRepository.save(todo);
        log.info("Đã cập nhật todo với ID: {}", updatedTodo.getId());

        return mapToResponse(updatedTodo);
    }

    /**
     * Lấy chi tiết 1 todo
     *
     * @param id ID của todo
     * @return TodoDetailResponse
     */
    @Transactional(readOnly = true)
    public TodoDetailResponse getById(Long id) {
        log.debug("Lấy chi tiết todo với ID: {}", id);

        User currentUser = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserIdAndDeletedAtIsNull(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo với ID: " + id));

        log.info("Đã lấy chi tiết todo với ID: {}", id);
        return mapToDetailResponse(todo);
    }

    /**
     * Lấy danh sách todos của user
     *
     * @param pageable Thông tin phân trang
     * @return Page chứa TodoResponse
     */
    @Transactional(readOnly = true)
    public Page<TodoResponse> getAll(Pageable pageable) {
        log.debug("Lấy danh sách todos với phân trang");

        User currentUser = getCurrentUser();
        
        // Create unsorted pageable to avoid conflict with native query ORDER BY
        Pageable unsortedPageable = org.springframework.data.domain.PageRequest.of(
            pageable.getPageNumber(), 
            pageable.getPageSize()
        );
        
        // Use native query that handles both NULL and '0000-00-00 00:00:00' deleted_at values
        Page<Todo> todos = todoRepository.findActiveTodosByUserId(currentUser.getId(), unsortedPageable);

        log.info("Đã lấy {} todos", todos.getTotalElements());
        return todos.map(this::mapToResponse);
    }

    /**
     * Soft delete todo (set deletedAt)
     *
     * @param id ID của todo cần xóa
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Xóa todo với ID: {}", id);

        User currentUser = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserIdAndDeletedAtIsNull(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo với ID: " + id));

        todo.setDeletedAt(LocalDateTime.now());
        todoRepository.save(todo);

        log.info("Đã xóa todo với ID: {}", id);
    }

    /**
     * Khôi phục todo từ trash (set deletedAt = null)
     *
     * @param id ID của todo cần khôi phục
     * @return TodoResponse sau khi khôi phục
     */
    @Transactional
    public TodoResponse restore(Long id) {
        log.debug("Khôi phục todo với ID: {}", id);

        User currentUser = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo với ID: " + id));

        if (todo.getDeletedAt() == null) {
            throw new BadRequestException("Todo chưa bị xóa");
        }

        todo.setDeletedAt(null);
        Todo restoredTodo = todoRepository.save(todo);

        log.info("Đã khôi phục todo với ID: {}", id);
        return mapToResponse(restoredTodo);
    }

    /**
     * Lấy danh sách todos đã xóa
     *
     * @param pageable Thông tin phân trang
     * @return Page chứa TodoResponse
     */
    @Transactional(readOnly = true)
    public Page<TodoResponse> getTrashed(Pageable pageable) {
        log.debug("Lấy danh sách todos đã xóa");

        User currentUser = getCurrentUser();
        Page<Todo> trashedTodos = todoRepository.findByUserIdAndDeletedAtIsNotNull(currentUser.getId(), pageable);

        log.info("Đã lấy {} todos đã xóa", trashedTodos.getTotalElements());
        return trashedTodos.map(this::mapToResponse);
    }

    /**
     * Tìm kiếm todos với filter phức tạp
     *
     * @param searchRequest TodoSearchRequest chứa các điều kiện tìm kiếm
     * @param pageable      Thông tin phân trang
     * @return Page chứa TodoResponse
     */
    @Transactional(readOnly = true)
    public Page<TodoResponse> search(TodoSearchRequest searchRequest, Pageable pageable) {
        log.debug("Tìm kiếm todos với điều kiện: {}", searchRequest);

        User currentUser = getCurrentUser();

        // Build specification
        Specification<Todo> spec = Specification.where(TodoSpecification.hasUserId(currentUser.getId()))
                .and(TodoSpecification.isNotDeleted())
                .and(TodoSpecification.isRootTodo());

        if (searchRequest.getQuery() != null && !searchRequest.getQuery().trim().isEmpty()) {
            spec = spec.and(TodoSpecification.titleOrDescriptionContains(searchRequest.getQuery()));
        }

        if (searchRequest.getStatus() != null) {
            spec = spec.and(TodoSpecification.hasStatus(searchRequest.getStatus()));
        }

        if (searchRequest.getPriority() != null) {
            spec = spec.and(TodoSpecification.hasPriority(searchRequest.getPriority()));
        }

        if (searchRequest.getCategoryId() != null) {
            spec = spec.and(TodoSpecification.hasCategoryId(searchRequest.getCategoryId()));
        }

        if (searchRequest.getTagIds() != null && !searchRequest.getTagIds().isEmpty()) {
            spec = spec.and(TodoSpecification.hasTagIds(new ArrayList<>(searchRequest.getTagIds())));
        }

        if (searchRequest.getDueFrom() != null || searchRequest.getDueTo() != null) {
            spec = spec.and(TodoSpecification.dueDateBetween(searchRequest.getDueFrom(), searchRequest.getDueTo()));
        }

        Page<Todo> todos = todoRepository.findAll(spec, pageable);

        log.info("Đã tìm thấy {} todos", todos.getTotalElements());
        return todos.map(this::mapToResponse);
    }

    /**
     * Cập nhật trạng thái của todo
     *
     * @param id     ID của todo
     * @param status Trạng thái mới
     * @return TodoResponse sau khi cập nhật
     */
    @Transactional
    public TodoResponse updateStatus(Long id, TodoStatus status) {
        log.debug("Cập nhật trạng thái todo với ID: {} sang {}", id, status);

        User currentUser = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserIdAndDeletedAtIsNull(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo với ID: " + id));

        todo.setStatus(status);
        todo.setUpdatedBy(currentUser.getId());

        Todo updatedTodo = todoRepository.save(todo);

        log.info("Đã cập nhật trạng thái todo với ID: {}", id);
        return mapToResponse(updatedTodo);
    }

    /**
     * Tạo subtask cho todo
     *
     * @param parentId ID của todo cha
     * @param request  TodoRequest chứa thông tin subtask
     * @return TodoResponse sau khi tạo
     */
    @Transactional
    public TodoResponse createSubtask(Long parentId, TodoRequest request) {
        log.debug("Tạo subtask cho todo với ID: {}", parentId);

        User currentUser = getCurrentUser();
        Todo parent = todoRepository.findByIdAndUserIdAndDeletedAtIsNull(parentId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo cha với ID: " + parentId));

        // Không cho phép tạo subtask cho subtask (chỉ 1 cấp)
        if (parent.getParent() != null) {
            throw new BadRequestException("Không thể tạo subtask cho một subtask");
        }

        Todo subtask = todoMapper.toEntity(request);
        subtask.setUser(currentUser);
        subtask.setParent(parent);

        // Set category nếu có
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy category với ID: " + request.getCategoryId()));
            subtask.setCategory(category);
        }

        // Set tags nếu có
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUserId(tagId, currentUser.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag với ID: " + tagId));
                tags.add(tag);
            }
            subtask.setTags(tags);
        }

        subtask.setCreatedBy(currentUser.getId());
        subtask.setUpdatedBy(currentUser.getId());

        Todo savedSubtask = todoRepository.save(subtask);

        log.info("Đã tạo subtask với ID: {} cho todo {}", savedSubtask.getId(), parentId);
        return mapToResponse(savedSubtask);
    }

    /**
     * Lấy danh sách subtasks của một todo
     *
     * @param parentId ID của todo cha
     * @return List chứa TodoResponse
     */
    @Transactional(readOnly = true)
    public List<TodoResponse> getSubtasks(Long parentId) {
        log.debug("Lấy danh sách subtasks của todo với ID: {}", parentId);

        User currentUser = getCurrentUser();
        Todo parent = todoRepository.findByIdAndUserIdAndDeletedAtIsNull(parentId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy todo với ID: " + parentId));

        List<TodoResponse> subtasks = parent.getSubtasks().stream()
                .filter(subtask -> subtask.getDeletedAt() == null)
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        log.info("Đã lấy {} subtasks", subtasks.size());
        return subtasks;
    }

    /**
     * Thống kê todos theo status
     *
     * @return Map chứa thống kê
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getStatistics() {
        log.debug("Lấy thống kê todos");

        User currentUser = getCurrentUser();
        Map<String, Long> statistics = new HashMap<>();

        statistics.put("PENDING", todoRepository.countByUserIdAndStatusAndDeletedAtIsNull(
                currentUser.getId(), TodoStatus.PENDING));
        statistics.put("IN_PROGRESS", todoRepository.countByUserIdAndStatusAndDeletedAtIsNull(
                currentUser.getId(), TodoStatus.IN_PROGRESS));
        statistics.put("DONE", todoRepository.countByUserIdAndStatusAndDeletedAtIsNull(
                currentUser.getId(), TodoStatus.DONE));

        Long totalActive = statistics.values().stream().mapToLong(Long::longValue).sum();
        statistics.put("TOTAL_ACTIVE", totalActive);

        log.info("Đã lấy thống kê todos: {}", statistics);
        return statistics;
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

    /**
     * Map Todo entity sang TodoResponse
     *
     * @param todo Todo entity
     * @return TodoResponse
     */
    private TodoResponse mapToResponse(Todo todo) {
        TodoResponse response = todoMapper.toResponse(todo);

        // Map category
        if (todo.getCategory() != null) {
            response.setCategory(categoryMapper.toResponse(todo.getCategory()));
        }

        // Map tags
        if (todo.getTags() != null && !todo.getTags().isEmpty()) {
            Set<TagResponse> tagResponses = todo.getTags().stream()
                    .map(tagMapper::toResponse)
                    .collect(Collectors.toSet());
            response.setTags(tagResponses);
        }

        return response;
    }

    /**
     * Map Todo entity sang TodoDetailResponse
     *
     * @param todo Todo entity
     * @return TodoDetailResponse
     */
    private TodoDetailResponse mapToDetailResponse(Todo todo) {
        TodoDetailResponse response = todoMapper.toDetailResponse(todo);

        // Map category
        if (todo.getCategory() != null) {
            response.setCategory(categoryMapper.toResponse(todo.getCategory()));
        }

        // Map tags
        if (todo.getTags() != null && !todo.getTags().isEmpty()) {
            Set<TagResponse> tagResponses = todo.getTags().stream()
                    .map(tagMapper::toResponse)
                    .collect(Collectors.toSet());
            response.setTags(tagResponses);
        }

        // Map subtasks
        if (todo.getSubtasks() != null && !todo.getSubtasks().isEmpty()) {
            List<TodoResponse> subtaskResponses = todo.getSubtasks().stream()
                    .filter(subtask -> subtask.getDeletedAt() == null)
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
            response.setSubtasks(subtaskResponses);
        }

        // Map attachments (sẽ được xử lý bởi AttachmentService nếu cần)
        response.setAttachments(new ArrayList<>());

        return response;
    }
}

