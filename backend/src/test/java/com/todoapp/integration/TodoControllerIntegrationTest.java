package com.todoapp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoapp.auth.dto.AuthResponse;
import com.todoapp.auth.dto.RegisterRequest;
import com.todoapp.todos.dto.TodoRequest;
import com.todoapp.todos.dto.TodoResponse;
import com.todoapp.todos.entity.*;
import com.todoapp.todos.repository.CategoryRepository;
import com.todoapp.todos.repository.TagRepository;
import com.todoapp.todos.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests cho TodoController sử dụng Testcontainers
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
@DisplayName("TodoController Integration Tests")
class TodoControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TagRepository tagRepository;

    private String accessToken;
    private Long userId;

    @BeforeEach
    void setUp() throws Exception {
        // Xóa tất cả dữ liệu
        todoRepository.deleteAll();
        categoryRepository.deleteAll();
        tagRepository.deleteAll();

        // Đăng ký user và lấy access token
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("todouser@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Todo User");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(responseJson, AuthResponse.class);
        accessToken = authResponse.getAccessToken();
        userId = authResponse.getUserId();
    }

    @Test
    @DisplayName("Test tạo todo thành công")
    void testCreateTodo() throws Exception {
        // Given
        TodoRequest request = TodoRequest.builder()
                .title("Test Todo")
                .description("Test Description")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.MEDIUM)
                .build();

        // When & Then
        MvcResult result = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Test Todo"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.priority").value("MEDIUM"))
                .andReturn();

        // Verify database state
        long todoCount = todoRepository.count();
        assertThat(todoCount).isEqualTo(1);

        Todo savedTodo = todoRepository.findAll().get(0);
        assertThat(savedTodo.getTitle()).isEqualTo("Test Todo");
        assertThat(savedTodo.getUser().getId()).isEqualTo(userId);
    }

    @Test
    @DisplayName("Test tạo todo không có authentication")
    void testCreateTodoWithoutAuth() throws Exception {
        // Given
        TodoRequest request = TodoRequest.builder()
                .title("Test Todo")
                .build();

        // When & Then
        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Test lấy danh sách todos")
    void testGetAllTodos() throws Exception {
        // Given - Tạo 3 todos
        for (int i = 1; i <= 3; i++) {
            TodoRequest request = TodoRequest.builder()
                    .title("Todo " + i)
                    .status(TodoStatus.PENDING)
                    .priority(TodoPriority.LOW)
                    .build();

            mockMvc.perform(post("/api/todos")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
        }

        // When & Then
        mockMvc.perform(get("/api/todos")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(3)))
                .andExpect(jsonPath("$.totalElements").value(3));
    }

    @Test
    @DisplayName("Test lấy chi tiết todo")
    void testGetTodoById() throws Exception {
        // Given - Tạo todo
        TodoRequest createRequest = TodoRequest.builder()
                .title("Detail Todo")
                .description("Detail Description")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.HIGH)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String createResponseJson = createResult.getResponse().getContentAsString();
        TodoResponse createdTodo = objectMapper.readValue(createResponseJson, TodoResponse.class);

        // When & Then
        mockMvc.perform(get("/api/todos/" + createdTodo.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdTodo.getId()))
                .andExpect(jsonPath("$.title").value("Detail Todo"))
                .andExpect(jsonPath("$.description").value("Detail Description"));
    }

    @Test
    @DisplayName("Test cập nhật todo")
    void testUpdateTodo() throws Exception {
        // Given - Tạo todo
        TodoRequest createRequest = TodoRequest.builder()
                .title("Original Title")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.LOW)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String createResponseJson = createResult.getResponse().getContentAsString();
        TodoResponse createdTodo = objectMapper.readValue(createResponseJson, TodoResponse.class);

        // When - Cập nhật todo
        TodoRequest updateRequest = TodoRequest.builder()
                .title("Updated Title")
                .description("Updated Description")
                .status(TodoStatus.IN_PROGRESS)
                .priority(TodoPriority.HIGH)
                .build();

        mockMvc.perform(put("/api/todos/" + createdTodo.getId())
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.priority").value("HIGH"));

        // Verify database state
        Todo updatedTodo = todoRepository.findById(createdTodo.getId()).orElse(null);
        assertThat(updatedTodo).isNotNull();
        assertThat(updatedTodo.getTitle()).isEqualTo("Updated Title");
    }

    @Test
    @DisplayName("Test xóa todo (soft delete)")
    void testDeleteTodo() throws Exception {
        // Given - Tạo todo
        TodoRequest createRequest = TodoRequest.builder()
                .title("To Delete")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.LOW)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String createResponseJson = createResult.getResponse().getContentAsString();
        TodoResponse createdTodo = objectMapper.readValue(createResponseJson, TodoResponse.class);

        // When - Xóa todo
        mockMvc.perform(delete("/api/todos/" + createdTodo.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNoContent());

        // Verify database state - todo vẫn tồn tại nhưng có deletedAt
        Todo deletedTodo = todoRepository.findById(createdTodo.getId()).orElse(null);
        assertThat(deletedTodo).isNotNull();
        assertThat(deletedTodo.getDeletedAt()).isNotNull();

        // Verify không thể lấy được todo đã xóa
        mockMvc.perform(get("/api/todos/" + createdTodo.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test tìm kiếm todos với filters")
    void testSearchTodos() throws Exception {
        // Given - Tạo todos với các status khác nhau
        TodoRequest pendingTodo = TodoRequest.builder()
                .title("Pending Todo")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.LOW)
                .build();

        TodoRequest inProgressTodo = TodoRequest.builder()
                .title("In Progress Todo")
                .status(TodoStatus.IN_PROGRESS)
                .priority(TodoPriority.HIGH)
                .build();

        mockMvc.perform(post("/api/todos")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pendingTodo)));

        mockMvc.perform(post("/api/todos")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inProgressTodo)));

        // When & Then - Search với status filter
        mockMvc.perform(get("/api/todos/search?status=PENDING")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].status").value("PENDING"));

        // Search với query
        mockMvc.perform(get("/api/todos/search?query=Progress")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("In Progress Todo"));
    }

    @Test
    @DisplayName("Test tạo subtask")
    void testCreateSubtask() throws Exception {
        // Given - Tạo parent todo
        TodoRequest parentRequest = TodoRequest.builder()
                .title("Parent Todo")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.MEDIUM)
                .build();

        MvcResult parentResult = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(parentRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String parentResponseJson = parentResult.getResponse().getContentAsString();
        TodoResponse parentTodo = objectMapper.readValue(parentResponseJson, TodoResponse.class);

        // When - Tạo subtask
        TodoRequest subtaskRequest = TodoRequest.builder()
                .title("Subtask")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.LOW)
                .build();

        mockMvc.perform(post("/api/todos/" + parentTodo.getId() + "/subtasks")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subtaskRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Subtask"));

        // Then - Verify có thể lấy danh sách subtasks
        mockMvc.perform(get("/api/todos/" + parentTodo.getId() + "/subtasks")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Subtask"));
    }

    @Test
    @DisplayName("Test cập nhật trạng thái todo")
    void testUpdateTodoStatus() throws Exception {
        // Given - Tạo todo
        TodoRequest createRequest = TodoRequest.builder()
                .title("Status Test")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.MEDIUM)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String createResponseJson = createResult.getResponse().getContentAsString();
        TodoResponse createdTodo = objectMapper.readValue(createResponseJson, TodoResponse.class);

        // When - Cập nhật status
        mockMvc.perform(patch("/api/todos/" + createdTodo.getId() + "/status?status=DONE")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"));

        // Verify database state
        Todo updatedTodo = todoRepository.findById(createdTodo.getId()).orElse(null);
        assertThat(updatedTodo).isNotNull();
        assertThat(updatedTodo.getStatus()).isEqualTo(TodoStatus.DONE);
    }

    @Test
    @DisplayName("Test khôi phục todo từ trash")
    void testRestoreTodo() throws Exception {
        // Given - Tạo và xóa todo
        TodoRequest createRequest = TodoRequest.builder()
                .title("Restore Test")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.LOW)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String createResponseJson = createResult.getResponse().getContentAsString();
        TodoResponse createdTodo = objectMapper.readValue(createResponseJson, TodoResponse.class);

        mockMvc.perform(delete("/api/todos/" + createdTodo.getId())
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNoContent());

        // When - Khôi phục todo
        mockMvc.perform(post("/api/todos/" + createdTodo.getId() + "/restore")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Restore Test"));

        // Verify database state
        Todo restoredTodo = todoRepository.findById(createdTodo.getId()).orElse(null);
        assertThat(restoredTodo).isNotNull();
        assertThat(restoredTodo.getDeletedAt()).isNull();
    }

    @Test
    @DisplayName("Test lấy thống kê todos")
    void testGetStatistics() throws Exception {
        // Given - Tạo todos với các status khác nhau
        createTodoWithStatus(TodoStatus.PENDING, 3);
        createTodoWithStatus(TodoStatus.IN_PROGRESS, 2);
        createTodoWithStatus(TodoStatus.DONE, 5);

        // When & Then
        mockMvc.perform(get("/api/todos/statistics")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.PENDING").value(3))
                .andExpect(jsonPath("$.IN_PROGRESS").value(2))
                .andExpect(jsonPath("$.DONE").value(5))
                .andExpect(jsonPath("$.TOTAL_ACTIVE").value(10));
    }

    @Test
    @DisplayName("Test authorization - user chỉ có thể truy cập todos của mình")
    void testAuthorization() throws Exception {
        // Given - Tạo todo với user 1
        TodoRequest request = TodoRequest.builder()
                .title("User 1 Todo")
                .status(TodoStatus.PENDING)
                .priority(TodoPriority.LOW)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String createResponseJson = createResult.getResponse().getContentAsString();
        TodoResponse createdTodo = objectMapper.readValue(createResponseJson, TodoResponse.class);

        // Tạo user 2
        RegisterRequest user2Request = new RegisterRequest();
        user2Request.setEmail("user2@example.com");
        user2Request.setPassword("password123");
        user2Request.setFullName("User 2");

        MvcResult user2Result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user2Request)))
                .andExpect(status().isCreated())
                .andReturn();

        String user2ResponseJson = user2Result.getResponse().getContentAsString();
        AuthResponse user2Auth = objectMapper.readValue(user2ResponseJson, AuthResponse.class);
        String user2Token = user2Auth.getAccessToken();

        // When & Then - User 2 không thể truy cập todo của user 1
        mockMvc.perform(get("/api/todos/" + createdTodo.getId())
                        .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isNotFound());

        // User 2 không thể cập nhật todo của user 1
        mockMvc.perform(put("/api/todos/" + createdTodo.getId())
                        .header("Authorization", "Bearer " + user2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());

        // User 2 không thể xóa todo của user 1
        mockMvc.perform(delete("/api/todos/" + createdTodo.getId())
                        .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isNotFound());
    }

    private void createTodoWithStatus(TodoStatus status, int count) throws Exception {
        for (int i = 0; i < count; i++) {
            TodoRequest request = TodoRequest.builder()
                    .title("Todo " + status + " " + i)
                    .status(status)
                    .priority(TodoPriority.LOW)
                    .build();

            mockMvc.perform(post("/api/todos")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
        }
    }
}

