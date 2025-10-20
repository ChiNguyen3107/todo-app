# 📋 HƯỚNG DẪN HOÀN THIỆN DỰ ÁN TODO APP

## 🎯 Tổng quan

Dự án hiện đã hoàn thành ~30% với cấu trúc cơ bản, entities, và migrations. Dưới đây là các prompt chi tiết để hoàn thiện từng phần còn lại.

---

## 📦 PHẦN 1: BACKEND - AUTHENTICATION MODULE (Ưu tiên cao)

### Prompt 1.1: Tạo RefreshTokenService

```
Trong dự án Todo App Spring Boot tại d:\todo_app\backend, hãy tạo RefreshTokenService với các chức năng:
- Tạo refresh token mới với thời gian hết hạn từ application.yml
- Validate refresh token (kiểm tra hết hạn, revoked)
- Revoke refresh token khi logout
- Xóa các token đã hết hạn (cleanup)
- Sử dụng RefreshTokenRepository đã có

File: backend/src/main/java/com/todoapp/auth/service/RefreshTokenService.java
```

### Prompt 1.2: Tạo AuthService

```
Trong dự án Todo App Spring Boot, tạo AuthService với các phương thức:
- register(RegisterRequest): tạo user mới với BCrypt password
- login(LoginRequest): xác thực và trả về access + refresh token
- refreshToken(String): tạo access token mới từ refresh token
- logout(String): revoke refresh token
- verifyEmail(String token): mock verify email (cập nhật emailVerified = true)

Sử dụng:
- UserRepository
- RefreshTokenService
- JwtService
- PasswordEncoder (BCrypt)
- Throw BadRequestException nếu email đã tồn tại hoặc credentials sai

File: backend/src/main/java/com/todoapp/auth/service/AuthService.java
```

### Prompt 1.3: Tạo JwtAuthenticationFilter

```
Tạo JwtAuthenticationFilter cho Spring Security:
- Extend OncePerRequestFilter
- Extract JWT từ header "Authorization: Bearer {token}"
- Validate token với JwtService
- Set Authentication vào SecurityContext
- Skip filter cho public endpoints: /api/auth/**, /swagger-ui/**, /v3/api-docs/**

File: backend/src/main/java/com/todoapp/auth/security/JwtAuthenticationFilter.java
```

### Prompt 1.4: Tạo SecurityConfig

```
Tạo SecurityConfig cho Spring Security 3.x:
- Disable CSRF (REST API)
- Stateless session management
- Public endpoints: /api/auth/**, /swagger-ui/**, /v3/api-docs/**, /actuator/health
- Protected endpoints: /api/** cần authentication
- Add JwtAuthenticationFilter
- Configure PasswordEncoder (BCrypt)
- Enable CORS cho http://localhost:3000

File: backend/src/main/java/com/todoapp/auth/security/SecurityConfig.java
```

### Prompt 1.5: Tạo AuthController

```
Tạo AuthController với các endpoints:
- POST /api/auth/register - đăng ký user mới
- POST /api/auth/login - đăng nhập
- POST /api/auth/refresh - refresh access token
- POST /api/auth/logout - đăng xuất
- POST /api/auth/verify-email?token=xxx - verify email (mock)

Validate request với @Valid
Trả về AuthResponse cho register/login/refresh
Log các event authentication

File: backend/src/main/java/com/todoapp/auth/controller/AuthController.java
```

### Prompt 1.6: Tạo Rate Limiting Service

```
Tạo RateLimitService sử dụng Bucket4j:
- Rate limit cho IP address
- Cấu hình từ application.yml (capacity, refill rate)
- Áp dụng cho /api/auth/register, /api/auth/login, /api/auth/refresh
- Throw RateLimitExceededException khi vượt giới hạn

File: backend/src/main/java/com/todoapp/auth/service/RateLimitService.java
File: backend/src/main/java/com/todoapp/common/exception/RateLimitExceededException.java
```

---

## 📦 PHẦN 2: BACKEND - USER MODULE

### Prompt 2.1: Tạo User DTOs và Mapper

```
Tạo các DTOs cho User module:
- UserResponse (id, email, fullName, role, emailVerified, status, createdAt)
- UpdateUserRequest (fullName)
- ChangePasswordRequest (oldPassword, newPassword)

Tạo UserMapper với MapStruct:
- toResponse(User): User -> UserResponse
- Cấu hình componentModel = "spring"

Files:
- backend/src/main/java/com/todoapp/user/dto/UserResponse.java
- backend/src/main/java/com/todoapp/user/dto/UpdateUserRequest.java
- backend/src/main/java/com/todoapp/user/dto/ChangePasswordRequest.java
- backend/src/main/java/com/todoapp/user/mapper/UserMapper.java
```

### Prompt 2.2: Tạo UserService

```
Tạo UserService với các phương thức:
- getUserById(Long id): lấy thông tin user
- getCurrentUser(): lấy user hiện tại từ SecurityContext
- updateProfile(Long id, UpdateUserRequest): cập nhật fullName
- changePassword(Long id, ChangePasswordRequest): đổi password
- Validate: user chỉ có thể update chính mình (trừ ADMIN)

File: backend/src/main/java/com/todoapp/user/service/UserService.java
```

### Prompt 2.3: Tạo UserController

```
Tạo UserController với endpoints:
- GET /api/users/me - lấy thông tin user hiện tại
- PUT /api/users/me - cập nhật profile
- PUT /api/users/me/password - đổi password

Requires authentication
Validate requests với @Valid

File: backend/src/main/java/com/todoapp/user/controller/UserController.java
```

---

## 📦 PHẦN 3: BACKEND - CATEGORY MODULE

### Prompt 3.1: Tạo CategoryRepository

```
Tạo CategoryRepository extends JpaRepository<Category, Long>:
- findByUserId(Long userId): lấy categories của user
- findByUserIdAndName(Long userId, String name): kiểm tra trùng tên
- findByIdAndUserId(Long id, Long userId): validate ownership

File: backend/src/main/java/com/todoapp/todos/repository/CategoryRepository.java
```

### Prompt 3.2: Tạo Category DTOs và Mapper

```
Tạo DTOs:
- CategoryRequest (name, color, orderIndex)
- CategoryResponse (id, name, color, orderIndex, createdAt, updatedAt)

Tạo CategoryMapper (MapStruct):
- toEntity(CategoryRequest): request -> entity
- toResponse(Category): entity -> response
- toResponseList(List<Category>): list mapping

Files:
- backend/src/main/java/com/todoapp/todos/dto/CategoryRequest.java
- backend/src/main/java/com/todoapp/todos/dto/CategoryResponse.java
- backend/src/main/java/com/todoapp/todos/mapper/CategoryMapper.java
```

### Prompt 3.3: Tạo CategoryService và CategoryController

```
Tạo CategoryService:
- create(CategoryRequest): tạo category cho user hiện tại
- update(Long id, CategoryRequest): cập nhật (validate ownership)
- delete(Long id): xóa (validate ownership)
- getAll(): lấy tất cả categories của user
- getById(Long id): lấy 1 category (validate ownership)
- updateOrderIndex(Long id, Integer newIndex): cập nhật thứ tự

Tạo CategoryController:
- POST /api/categories
- GET /api/categories
- GET /api/categories/{id}
- PUT /api/categories/{id}
- DELETE /api/categories/{id}
- PATCH /api/categories/{id}/order?index=5

Files:
- backend/src/main/java/com/todoapp/todos/service/CategoryService.java
- backend/src/main/java/com/todoapp/todos/controller/CategoryController.java
```

---

## 📦 PHẦN 4: BACKEND - TAG MODULE

### Prompt 4.1: Tạo TagRepository, DTOs, Mapper

```
Tương tự Category module, tạo:
- TagRepository với findByUserId, findByUserIdAndName, findByIdAndUserId
- TagRequest (name, color)
- TagResponse (id, name, color, createdAt)
- TagMapper (MapStruct)

Files:
- backend/src/main/java/com/todoapp/todos/repository/TagRepository.java
- backend/src/main/java/com/todoapp/todos/dto/TagRequest.java
- backend/src/main/java/com/todoapp/todos/dto/TagResponse.java
- backend/src/main/java/com/todoapp/todos/mapper/TagMapper.java
```

### Prompt 4.2: Tạo TagService và TagController

```
Tạo TagService và TagController tương tự Category:
- CRUD operations
- Validate ownership
- Endpoints: GET/POST/PUT/DELETE /api/tags

Files:
- backend/src/main/java/com/todoapp/todos/service/TagService.java
- backend/src/main/java/com/todoapp/todos/controller/TagController.java
```

---

## 📦 PHẦN 5: BACKEND - TODO MODULE (Phức tạp nhất)

### Prompt 5.1: Tạo TodoRepository

```
Tạo TodoRepository với custom queries:
- findByUserIdAndDeletedAtIsNull(Long userId, Pageable): todos chưa xóa
- findByUserIdAndDeletedAtIsNotNull(Long userId, Pageable): trash
- findByIdAndUserId(Long id, Long userId): validate ownership
- countByUserIdAndStatus(Long userId, TodoStatus): thống kê

Thêm method specification cho search/filter:
- findAll(Specification<Todo>, Pageable)

File: backend/src/main/java/com/todoapp/todos/repository/TodoRepository.java
```

### Prompt 5.2: Tạo TodoSpecification

```
Tạo TodoSpecification cho filter/search:
- hasUserId(Long userId)
- hasStatus(TodoStatus status)
- hasPriority(TodoPriority priority)
- hasCategoryId(Long categoryId)
- hasTagIds(List<Long> tagIds)
- dueDateBetween(LocalDateTime from, LocalDateTime to)
- titleOrDescriptionContains(String query)
- isNotDeleted()

File: backend/src/main/java/com/todoapp/todos/specification/TodoSpecification.java
```

### Prompt 5.3: Tạo Todo DTOs

```
Tạo các DTOs:
- TodoRequest (title, description, status, priority, dueDate, remindAt, estimatedMinutes, categoryId, tagIds)
- TodoResponse (tất cả fields + category, tags, subtasks count, attachments count)
- TodoDetailResponse (extends TodoResponse + full subtasks, attachments)
- TodoSearchRequest (query, status, priority, categoryId, tagIds, dueFrom, dueTo)
- AttachmentRequest (fileName, fileUrl, fileSize)
- AttachmentResponse (id, fileName, fileUrl, fileSize, createdAt)

Files trong backend/src/main/java/com/todoapp/todos/dto/
```

### Prompt 5.4: Tạo TodoMapper

```
Tạo TodoMapper (MapStruct):
- toEntity(TodoRequest): map request sang entity
- toResponse(Todo): basic response
- toDetailResponse(Todo): response với subtasks và attachments
- Ignore collections khi map để tránh lazy loading issues

File: backend/src/main/java/com/todoapp/todos/mapper/TodoMapper.java
```

### Prompt 5.5: Tạo AttachmentService

```
Tạo AttachmentService:
- addAttachment(Long todoId, AttachmentRequest): thêm attachment (mock upload)
- deleteAttachment(Long attachmentId): xóa attachment
- getAttachmentsByTodoId(Long todoId): lấy danh sách
- Validate todo ownership

File: backend/src/main/java/com/todoapp/todos/service/AttachmentService.java
```

### Prompt 5.6: Tạo TodoService (Phần 1 - CRUD)

```
Tạo TodoService với các method cơ bản:
- create(TodoRequest): tạo todo cho user hiện tại
- update(Long id, TodoRequest): cập nhật (validate ownership)
- getById(Long id): lấy chi tiết 1 todo
- getAll(Pageable): lấy danh sách todos của user
- delete(Long id): soft delete (set deletedAt)
- restore(Long id): khôi phục từ trash (set deletedAt = null)
- getTrashed(Pageable): lấy todos đã xóa

File: backend/src/main/java/com/todoapp/todos/service/TodoService.java
```

### Prompt 5.7: Tạo TodoService (Phần 2 - Advanced)

```
Thêm vào TodoService các method nâng cao:
- search(TodoSearchRequest, Pageable): search với filter phức tạp
  * Sử dụng TodoSpecification
  * Combine multiple filters với Specification.where()
- updateStatus(Long id, TodoStatus status): cập nhật trạng thái
- createSubtask(Long parentId, TodoRequest): tạo subtask
- getSubtasks(Long parentId): lấy danh sách subtasks
- getStatistics(): thống kê theo status (PENDING, IN_PROGRESS, DONE)

Cập nhật file: backend/src/main/java/com/todoapp/todos/service/TodoService.java
```

### Prompt 5.8: Tạo TodoController (Full endpoints)

```
Tạo TodoController với tất cả endpoints:
- POST /api/todos - tạo todo
- GET /api/todos - danh sách todos (pagination)
- GET /api/todos/{id} - chi tiết todo
- PUT /api/todos/{id} - cập nhật todo
- DELETE /api/todos/{id} - xóa (soft delete)
- PATCH /api/todos/{id}/status - cập nhật trạng thái
- GET /api/todos/search - tìm kiếm nâng cao
  * Params: query, status, priority, categoryId, tagIds, dueFrom, dueTo, page, size, sort
- POST /api/todos/{id}/subtasks - tạo subtask
- GET /api/todos/{id}/subtasks - lấy subtasks
- POST /api/todos/{id}/attachments - thêm attachment
- GET /api/todos/trash - lấy todos đã xóa
- POST /api/todos/{id}/restore - khôi phục
- GET /api/todos/statistics - thống kê

File: backend/src/main/java/com/todoapp/todos/controller/TodoController.java
```

---

## 📦 PHẦN 6: BACKEND - TESTING & DOCKER

### Prompt 6.1: Tạo Backend Dockerfile

```
Tạo Dockerfile multi-stage cho backend:
- Stage 1 (builder): sử dụng gradle:8.5-jdk17 để build
  * Copy gradle files và source code
  * Run ./gradlew bootJar --no-daemon
- Stage 2 (runtime): sử dụng eclipse-temurin:17-jre-alpine
  * Copy JAR từ builder stage
  * Expose port 8080
  * Healthcheck với curl actuator/health
  * CMD java -jar app.jar

File: backend/Dockerfile
```

### Prompt 6.2: Tạo Unit Tests

```
Tạo unit tests cho các service chính:
1. AuthServiceTest:
   - testRegisterSuccess
   - testRegisterDuplicateEmail
   - testLoginSuccess
   - testLoginInvalidCredentials
   - testRefreshToken

2. TodoServiceTest:
   - testCreateTodo
   - testUpdateTodo
   - testDeleteTodo (soft delete)
   - testSearchWithFilters
   - testCreateSubtask

Sử dụng:
- @ExtendWith(MockitoExtension.class)
- @Mock repositories
- @InjectMocks services
- Mockito.when() để mock
- assertThat() cho assertions

Files trong backend/src/test/java/com/todoapp/
```

### Prompt 6.3: Tạo Integration Tests với Testcontainers

```
Tạo integration tests:
1. AuthControllerIntegrationTest:
   - Test register/login/refresh flows
   - Sử dụng @Testcontainers và PostgreSQLContainer
   - MockMvc để call endpoints
   - Verify database state

2. TodoControllerIntegrationTest:
   - Test CRUD operations
   - Test search/filter
   - Test authentication/authorization

Config:
- @SpringBootTest(webEnvironment = RANDOM_PORT)
- @Testcontainers
- @Container PostgreSQLContainer
- @AutoConfigureMockMvc

Files trong backend/src/test/java/com/todoapp/integration/
```

---

## 📦 PHẦN 7: FRONTEND - SETUP

### Prompt 7.1: Khởi tạo Frontend Project

```
Tạo frontend project với Vite + React + TypeScript:

1. Chạy lệnh:
cd d:\todo_app
npm create vite@latest frontend -- --template react-ts

2. Cài dependencies:
cd frontend
npm install

3. Cài thêm các packages:
npm install react-router-dom zustand axios
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node
npm install lucide-react date-fns
npm install react-hook-form zod @hookform/resolvers

4. Init Tailwind:
npx tailwindcss init -p
```

### Prompt 7.2: Cấu hình Tailwind CSS

```
Cấu hình Tailwind CSS:

1. Cập nhật tailwind.config.js:
- content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
- theme: extend colors, spacing
- plugins: []

2. Cập nhật src/index.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

3. Thêm custom styles nếu cần

Files:
- frontend/tailwind.config.js
- frontend/src/index.css
```

### Prompt 7.3: Tạo TypeScript Types

```
Tạo file types cho toàn bộ DTOs:

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  status: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  category?: Category;
  tags?: Tag[];
  subtasksCount?: number;
  attachmentsCount?: number;
}

// + Category, Tag, Attachment, SearchParams types...

File: frontend/src/types/index.ts
```

### Prompt 7.4: Tạo Axios Instance

```
Tạo axios client với interceptors:

- Base URL từ env: VITE_API_URL
- Request interceptor: inject access token từ localStorage
- Response interceptor:
  * Nếu 401: thử refresh token
  * Nếu refresh thành công: retry request gốc
  * Nếu refresh fail: clear tokens, redirect /login
- Export các API functions: auth, todos, categories, tags

File: frontend/src/lib/api.ts
```

### Prompt 7.5: Tạo Auth Store với Zustand

```
Tạo Zustand store cho authentication:

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

- Lưu tokens vào localStorage
- Restore từ localStorage khi init
- Provide login/logout methods

File: frontend/src/store/authStore.ts
```

### Prompt 7.6: Tạo Todo Store

```
Tạo Zustand store cho todos:

interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  filters: SearchParams;
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: number, todo: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  setFilters: (filters: Partial<SearchParams>) => void;
}

File: frontend/src/store/todoStore.ts
```

---

## 📦 PHẦN 8: FRONTEND - AUTH FEATURES

### Prompt 8.1: Tạo Login Page

```
Tạo Login component:
- Form với email và password
- Validation với react-hook-form + zod
- Call API login
- Lưu tokens vào store
- Redirect đến /todos sau khi login thành công
- Hiển thị error messages
- Link đến register page

File: frontend/src/features/auth/Login.tsx
```

### Prompt 8.2: Tạo Register Page

```
Tạo Register component:
- Form với email, password, fullName
- Validation: email format, password min 8 chars
- Call API register
- Auto login sau register
- Redirect đến /todos
- Hiển thị error messages
- Link đến login page

File: frontend/src/features/auth/Register.tsx
```

### Prompt 8.3: Tạo AuthGuard Component

```
Tạo AuthGuard wrapper:
- Check isAuthenticated từ store
- Nếu chưa login: redirect đến /login
- Nếu đã login: render children
- Show loading state khi đang check

File: frontend/src/features/auth/AuthGuard.tsx
```

### Prompt 8.4: Tạo Router Config

```
Tạo React Router config:

Routes:
- / -> redirect /todos
- /login -> Login page (public)
- /register -> Register page (public)
- /todos -> TodoList (protected)
- /todos/:id -> TodoDetail (protected)
- /categories -> CategoryList (protected)
- /tags -> TagList (protected)
- /profile -> Profile (protected)

File: frontend/src/App.tsx
```

---

## 📦 PHẦN 9: FRONTEND - TODO FEATURES

### Prompt 9.1: Tạo TodoList Component

```
Tạo TodoList với đầy đủ tính năng:
- Hiển thị danh sách todos dạng table/cards
- Pagination
- Filter sidebar:
  * Status dropdown
  * Priority dropdown
  * Category select
  * Tags multi-select
  * Date range picker
  * Search input
- Sort options
- Actions: Edit, Delete, Change Status
- Click vào todo -> navigate đến detail page
- Floating button "+" để tạo todo mới

File: frontend/src/features/todos/TodoList.tsx
```

### Prompt 9.2: Tạo TodoForm Component

```
Tạo TodoForm (dùng cho cả Create và Edit):
- Form fields:
  * Title (required)
  * Description (textarea)
  * Status (select)
  * Priority (select)
  * Due date (date picker)
  * Category (select)
  * Tags (multi-select)
- Validation với react-hook-form + zod
- Submit: call API create/update
- Optimistic update
- Toast notification

File: frontend/src/features/todos/TodoForm.tsx
```

### Prompt 9.3: Tạo TodoDetail Component

```
Tạo TodoDetail page:
- Hiển thị toàn bộ thông tin todo
- Section cho subtasks:
  * Danh sách subtasks
  * Button thêm subtask
  * Checkbox toggle complete
- Section cho attachments:
  * Danh sách files
  * Button upload (mock)
  * Download/delete actions
- Actions: Edit, Delete, Change Status
- Back button về list

File: frontend/src/features/todos/TodoDetail.tsx
```

### Prompt 9.4: Tạo TodoFilter Component

```
Tạo TodoFilter sidebar/panel:
- Search input với debounce
- Status filter (checkboxes)
- Priority filter (checkboxes)
- Category dropdown
- Tags multi-select
- Date range: Due from/to
- Reset filters button
- Apply filters -> update URL params và call API

File: frontend/src/features/todos/TodoFilter.tsx
```

---

## 📦 PHẦN 10: FRONTEND - CATEGORIES & TAGS

### Prompt 10.1: Tạo CategoryList

```
Tạo CategoryList component:
- Hiển thị danh sách categories
- Inline edit (click vào name để edit)
- Color picker cho mỗi category
- Drag & drop để reorder (orderIndex)
- Add new category
- Delete category (confirm dialog)

File: frontend/src/features/categories/CategoryList.tsx
```

### Prompt 10.2: Tạo TagList

```
Tạo TagList component tương tự:
- Hiển thị dạng tags/badges
- Inline edit name và color
- Add new tag
- Delete tag

File: frontend/src/features/tags/TagList.tsx
```

### Prompt 10.3: Tạo Profile Page

```
Tạo Profile component:
- Hiển thị thông tin user
- Form edit fullName
- Form change password (old + new password)
- Logout button

File: frontend/src/features/profile/Profile.tsx
```

---

## 📦 PHẦN 11: FRONTEND - UI COMPONENTS & LAYOUT

### Prompt 11.1: Tạo Layout Component

```
Tạo Layout với:
- Navbar (top): logo, navigation links, user menu
- Sidebar (left - optional): quick filters
- Main content area
- Footer (optional)

File: frontend/src/components/Layout.tsx
```

### Prompt 11.2: Tạo Navbar Component

```
Tạo Navbar:
- Logo/Title
- Navigation: Todos, Categories, Tags
- Right side:
  * User avatar/name
  * Dropdown menu: Profile, Logout
- Mobile responsive (hamburger menu)

File: frontend/src/components/Navbar.tsx
```

### Prompt 11.3: Tạo Reusable Components

```
Tạo các components tái sử dụng:
- Button (variants: primary, secondary, danger)
- Input, Textarea
- Select, MultiSelect
- Modal/Dialog
- Toast notifications
- Loading spinner
- Empty state
- Error boundary

Files trong frontend/src/components/ui/
```

### Prompt 11.4: Tạo Frontend Dockerfile

```
Tạo Dockerfile cho frontend:
- Stage 1 (builder):
  * node:18-alpine
  * Copy package files
  * npm install
  * npm run build
- Stage 2 (runtime):
  * nginx:alpine
  * Copy build output từ builder
  * Copy nginx.conf
  * Expose port 80

Tạo nginx.conf:
- Serve static files từ /usr/share/nginx/html
- Fallback tất cả routes về index.html (SPA)
- Proxy /api -> backend:8080

Files:
- frontend/Dockerfile
- frontend/nginx.conf
```

---

## 📦 PHẦN 12: DOCUMENTATION & SCRIPTS

### Prompt 12.1: Tạo Postman Collection

```
Tạo Postman collection với tất cả endpoints:

Structure:
- Folder: Authentication
  * Register
  * Login
  * Refresh Token
  * Logout
- Folder: Users
  * Get Current User
  * Update Profile
  * Change Password
- Folder: Todos
  * Create Todo
  * Get Todos
  * Get Todo by ID
  * Update Todo
  * Delete Todo
  * Search Todos
  * Create Subtask
  * Update Status
  * Trash/Restore
- Folder: Categories (CRUD)
- Folder: Tags (CRUD)

Config:
- Environment variables: base_url, access_token
- Pre-request scripts để auto inject token
- Tests để extract tokens sau login

File: postman/todo-app.postman_collection.json
```

### Prompt 12.2: Tạo DEV_START.bat Script

```
Tạo script Windows để start full stack:

@echo off
echo Starting Todo App Development Environment...

echo Checking Java...
java -version || (echo Java not found! && exit /b 1)

echo Checking Node...
node -v || (echo Node not found! && exit /b 1)

echo Starting PostgreSQL...
docker run -d --name todo-db -p 5432:5432 -e POSTGRES_DB=tododb -e POSTGRES_USER=todouser -e POSTGRES_PASSWORD=todopass postgres:15-alpine

echo Waiting for database...
timeout /t 10

echo Starting Backend...
cd backend
start cmd /k "gradlew bootRun"
cd ..

echo Waiting for backend...
timeout /t 20

echo Starting Frontend...
cd frontend
start cmd /k "npm run dev"
cd ..

echo Done! Access at http://localhost:3000

File: scripts/DEV_START.bat
```

### Prompt 12.3: Cập nhật README

```
Cập nhật README.md với:
- Thêm screenshots (optional)
- Thêm API documentation links
- Thêm troubleshooting section chi tiết
- Thêm contributing guidelines
- Thêm license information
- Thêm changelog

File: README.md
```

---

## 📦 PHẦN 13: FINAL - TESTING & DEPLOYMENT

### Prompt 13.1: Kiểm tra lỗi Backend

```
Kiểm tra và fix lỗi backend:
1. Run: cd backend && ./gradlew build
2. Kiểm tra compilation errors
3. Run tests: ./gradlew test
4. Fix failing tests
5. Check code coverage
6. Run với: ./gradlew bootRun
7. Test endpoints với Postman
8. Kiểm tra logs
```

### Prompt 13.2: Kiểm tra lỗi Frontend

```
Kiểm tra và fix lỗi frontend:
1. Run: cd frontend && npm run build
2. Fix TypeScript errors
3. Run linter: npm run lint
4. Fix linting errors
5. Test trên browser
6. Test responsive design
7. Test all user flows
```

### Prompt 13.3: Test với Docker Compose

```
Test full stack với Docker:
1. Build images: docker compose build
2. Start services: docker compose up -d
3. Check logs: docker compose logs -f
4. Test health checks
5. Test connectivity giữa services
6. Test database migrations
7. Test frontend -> backend -> database flow
```

### Prompt 13.4: Commit và Push Final

```
Commit tất cả thay đổi:
git add .
git commit -m "- Hoan thanh backend voi tat ca controllers va services
- Hoan thanh frontend voi React, Zustand, TailwindCSS
- Them unit tests va integration tests
- Them Dockerfiles va docker-compose setup
- Them Postman collection va scripts
- Cap nhat documentation day du"

git push origin main
```

---

## 🎯 ƯU TIÊN THỰC HIỆN

### Phase 1 (Critical - Để chạy được app):

1. Authentication Module (1.1 -> 1.5)
2. Security Config (1.4)
3. Frontend Setup (7.1 -> 7.6)
4. Auth UI (8.1 -> 8.4)

### Phase 2 (Core Features):

5. Todo Module (5.1 -> 5.8)
6. Todo UI (9.1 -> 9.3)
7. Category & Tag (3.x, 4.x, 10.x)

### Phase 3 (Polish):

8. User Module (2.x)
9. Testing (6.2, 6.3)
10. Docker & Scripts (6.1, 12.2)
11. Documentation (12.1, 12.3)

### Phase 4 (Final):

12. Fix bugs (13.1, 13.2)
13. Deploy (13.3, 13.4)

---

## 💡 TIPS

1. **Làm từng prompt một**: Đừng skip, làm theo thứ tự
2. **Test ngay sau mỗi module**: Đừng chờ đến cuối mới test
3. **Commit thường xuyên**: Mỗi module xong là commit
4. **Đọc logs**: Khi có lỗi, đọc kỹ error message
5. **Reference code đã có**: Xem các entity, repo đã tạo để học pattern

## 🆘 NẾU GẶP LỖI

- **Backend không compile**: Check import statements, dependencies trong build.gradle.kts
- **Frontend type errors**: Check types/index.ts, cập nhật interfaces
- **API 404**: Check controller paths, security config
- **CORS errors**: Update SecurityConfig CORS settings
- **Database errors**: Check migrations, entity relationships

Chúc bạn hoàn thành dự án thành công! 🚀
