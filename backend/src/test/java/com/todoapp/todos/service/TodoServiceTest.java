package com.todoapp.todos.service;

import com.todoapp.auth.entity.User;
import com.todoapp.auth.repository.UserRepository;
import com.todoapp.common.exception.BadRequestException;
import com.todoapp.common.exception.ResourceNotFoundException;
import com.todoapp.todos.dto.TodoRequest;
import com.todoapp.todos.dto.TodoResponse;
import com.todoapp.todos.dto.TodoSearchRequest;
import com.todoapp.todos.entity.Category;
import com.todoapp.todos.entity.Tag;
import com.todoapp.todos.entity.Todo;
import com.todoapp.todos.entity.TodoPriority;
import com.todoapp.todos.entity.TodoStatus;
import com.todoapp.todos.mapper.CategoryMapper;
import com.todoapp.todos.mapper.TagMapper;
import com.todoapp.todos.mapper.TodoMapper;
import com.todoapp.todos.repository.CategoryRepository;
import com.todoapp.todos.repository.TagRepository;
import com.todoapp.todos.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests cho TodoService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TodoService Tests")
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TodoMapper todoMapper;

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private TagMapper tagMapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TodoService todoService;

    private User user;
    private Todo todo;
    private TodoRequest todoRequest;
    private TodoResponse todoResponse;
    private Category category;
    private Tag tag;

    @BeforeEach
    void setUp() {
        // Setup User
        user = User.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .build();

        // Setup Category
        category = Category.builder()
                .id(1L)
                .name("Work")
                .user(user)
                .build();

        // Setup Tag
        tag = Tag.builder()
                .id(1L)
                .name("Important")
                .user(user)
                .build();

        // Setup TodoRequest
        todoRequest = TodoRequest.builder()
                .title("Test Todo")
                .description("Test Description")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.MEDIUM)
                .categoryId(1L)
                .tagIds(Set.of(1L))
                .build();

        // Setup Todo
        todo = Todo.builder()
                .id(1L)
                .title("Test Todo")
                .description("Test Description")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.MEDIUM)
                .user(user)
                .category(category)
                .tags(Set.of(tag))
                .subtasks(new ArrayList<>())
                .build();

        // Setup TodoResponse
        todoResponse = TodoResponse.builder()
                .id(1L)
                .title("Test Todo")
                .description("Test Description")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.MEDIUM)
                .build();

        // Mock SecurityContext
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("Test tạo todo thành công")
    void testCreateTodo() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoMapper.toEntity(todoRequest)).thenReturn(todo);
        when(categoryRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(category));
        when(tagRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(tag));
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);
        when(todoMapper.toResponse(todo)).thenReturn(todoResponse);

        // When
        TodoResponse response = todoService.create(todoRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Test Todo");

        verify(todoRepository).save(any(Todo.class));
        verify(categoryRepository).findByIdAndUserId(1L, user.getId());
        verify(tagRepository).findByIdAndUserId(1L, user.getId());
    }

    @Test
    @DisplayName("Test tạo todo với category không tồn tại")
    void testCreateTodoWithInvalidCategory() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoMapper.toEntity(todoRequest)).thenReturn(todo);
        when(categoryRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> todoService.create(todoRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy category");

        verify(todoRepository, never()).save(any(Todo.class));
    }

    @Test
    @DisplayName("Test cập nhật todo thành công")
    void testUpdateTodo() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByIdAndUserIdAndDeletedAtIsNull(1L, user.getId()))
                .thenReturn(Optional.of(todo));
        when(categoryRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(category));
        when(tagRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(tag));
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);
        when(todoMapper.toResponse(todo)).thenReturn(todoResponse);

        // When
        TodoResponse response = todoService.update(1L, todoRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);

        verify(todoRepository).findByIdAndUserIdAndDeletedAtIsNull(1L, user.getId());
        verify(todoRepository).save(any(Todo.class));
    }

    @Test
    @DisplayName("Test cập nhật todo không tồn tại")
    void testUpdateTodoNotFound() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByIdAndUserIdAndDeletedAtIsNull(999L, user.getId()))
                .thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> todoService.update(999L, todoRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy todo");

        verify(todoRepository, never()).save(any(Todo.class));
    }

    @Test
    @DisplayName("Test xóa todo (soft delete) thành công")
    void testDeleteTodo() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByIdAndUserIdAndDeletedAtIsNull(1L, user.getId()))
                .thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);

        // When
        todoService.delete(1L);

        // Then
        verify(todoRepository).findByIdAndUserIdAndDeletedAtIsNull(1L, user.getId());
        verify(todoRepository).save(argThat(savedTodo -> savedTodo.getDeletedAt() != null));
    }

    @Test
    @DisplayName("Test tìm kiếm todos với filters")
    void testSearchWithFilters() {
        // Given
        TodoSearchRequest searchRequest = TodoSearchRequest.builder()
                .query("test")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.MEDIUM)
                .categoryId(1L)
                .build();

        Pageable pageable = PageRequest.of(0, 10);
        List<Todo> todos = Collections.singletonList(todo);
        Page<Todo> todoPage = new PageImpl<>(todos, pageable, 1);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(todoPage);
        when(todoMapper.toResponse(any(Todo.class))).thenReturn(todoResponse);

        // When
        Page<TodoResponse> result = todoService.search(searchRequest, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent()).hasSize(1);

        verify(todoRepository).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    @DisplayName("Test tạo subtask thành công")
    void testCreateSubtask() {
        // Given
        Todo subtask = Todo.builder()
                .id(2L)
                .title("Subtask")
                .user(user)
                .parent(todo)
                .build();

        TodoRequest subtaskRequest = TodoRequest.builder()
                .title("Subtask")
                .build();

        TodoResponse subtaskResponse = TodoResponse.builder()
                .id(2L)
                .title("Subtask")
                .build();

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByIdAndUserIdAndDeletedAtIsNull(1L, user.getId()))
                .thenReturn(Optional.of(todo));
        when(todoMapper.toEntity(subtaskRequest)).thenReturn(subtask);
        when(todoRepository.save(any(Todo.class))).thenReturn(subtask);
        when(todoMapper.toResponse(subtask)).thenReturn(subtaskResponse);

        // When
        TodoResponse response = todoService.createSubtask(1L, subtaskRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getTitle()).isEqualTo("Subtask");

        verify(todoRepository).findByIdAndUserIdAndDeletedAtIsNull(1L, user.getId());
        verify(todoRepository).save(any(Todo.class));
    }

    @Test
    @DisplayName("Test tạo subtask cho subtask (không cho phép)")
    void testCreateSubtaskForSubtask() {
        // Given
        Todo parentTodo = Todo.builder()
                .id(3L)
                .title("Parent")
                .user(user)
                .build();

        todo.setParent(parentTodo); // todo hiện tại là subtask

        TodoRequest subtaskRequest = TodoRequest.builder()
                .title("Subtask of Subtask")
                .build();

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByIdAndUserIdAndDeletedAtIsNull(1L, user.getId()))
                .thenReturn(Optional.of(todo));

        // When & Then
        assertThatThrownBy(() -> todoService.createSubtask(1L, subtaskRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Không thể tạo subtask cho một subtask");

        verify(todoRepository, never()).save(any(Todo.class));
    }

    @Test
    @DisplayName("Test lấy danh sách todos")
    void testGetAll() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Todo> todos = Collections.singletonList(todo);
        Page<Todo> todoPage = new PageImpl<>(todos, pageable, 1);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByUserIdAndDeletedAtIsNull(user.getId(), pageable)).thenReturn(todoPage);
        when(todoMapper.toResponse(any(Todo.class))).thenReturn(todoResponse);

        // When
        Page<TodoResponse> result = todoService.getAll(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent()).hasSize(1);

        verify(todoRepository).findByUserIdAndDeletedAtIsNull(user.getId(), pageable);
    }

    @Test
    @DisplayName("Test cập nhật trạng thái todo")
    void testUpdateStatus() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByIdAndUserIdAndDeletedAtIsNull(1L, user.getId()))
                .thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);
        when(todoMapper.toResponse(todo)).thenReturn(todoResponse);

        // When
        TodoResponse response = todoService.updateStatus(1L, TodoStatus.DONE);

        // Then
        assertThat(response).isNotNull();
        verify(todoRepository).save(argThat(savedTodo -> savedTodo.getStatus() == TodoStatus.DONE));
    }

    @Test
    @DisplayName("Test khôi phục todo từ trash")
    void testRestore() {
        // Given
        todo.setDeletedAt(LocalDateTime.now());
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByIdAndUserId(1L, user.getId()))
                .thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);
        when(todoMapper.toResponse(todo)).thenReturn(todoResponse);

        // When
        TodoResponse response = todoService.restore(1L);

        // Then
        assertThat(response).isNotNull();
        verify(todoRepository).save(argThat(savedTodo -> savedTodo.getDeletedAt() == null));
    }

    @Test
    @DisplayName("Test khôi phục todo chưa bị xóa")
    void testRestoreNotDeletedTodo() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.findByIdAndUserId(1L, user.getId()))
                .thenReturn(Optional.of(todo));

        // When & Then
        assertThatThrownBy(() -> todoService.restore(1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Todo chưa bị xóa");

        verify(todoRepository, never()).save(any(Todo.class));
    }

    @Test
    @DisplayName("Test lấy thống kê todos")
    void testGetStatistics() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(todoRepository.countByUserIdAndStatusAndDeletedAtIsNull(user.getId(), TodoStatus.PENDING))
                .thenReturn(5L);
        when(todoRepository.countByUserIdAndStatusAndDeletedAtIsNull(user.getId(), TodoStatus.IN_PROGRESS))
                .thenReturn(3L);
        when(todoRepository.countByUserIdAndStatusAndDeletedAtIsNull(user.getId(), TodoStatus.DONE))
                .thenReturn(10L);

        // When
        Map<String, Long> statistics = todoService.getStatistics();

        // Then
        assertThat(statistics).isNotNull();
        assertThat(statistics.get("PENDING")).isEqualTo(5L);
        assertThat(statistics.get("IN_PROGRESS")).isEqualTo(3L);
        assertThat(statistics.get("DONE")).isEqualTo(10L);
        assertThat(statistics.get("TOTAL_ACTIVE")).isEqualTo(18L);

        verify(todoRepository).countByUserIdAndStatusAndDeletedAtIsNull(user.getId(), TodoStatus.PENDING);
        verify(todoRepository).countByUserIdAndStatusAndDeletedAtIsNull(user.getId(), TodoStatus.IN_PROGRESS);
        verify(todoRepository).countByUserIdAndStatusAndDeletedAtIsNull(user.getId(), TodoStatus.DONE);
    }
}

