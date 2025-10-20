# Todo App - Full-Stack Monorepo

> Ứng dụng quản lý Todo với Backend Spring Boot + Frontend React TypeScript

## 📋 Tính năng

- ✅ Authentication (JWT + Refresh Token)
- ✅ Quản lý Todo với Subtasks
- ✅ Categories & Tags
- ✅ Advanced Search & Filter
- ✅ Soft Delete & Restore
- ✅ File Attachments
- ✅ Rate Limiting
- ✅ OpenAPI/Swagger Documentation

## 🏗️ Kiến trúc

```
todo-app/
├── backend/          # Spring Boot 3 + Java 17
├── frontend/         # React 18 + Vite + TypeScript
├── docker-compose.yml
└── README.md
```

## 🚀 Chạy ứng dụng

### A. Chạy với Docker Compose (Khuyên dùng)

```bash
# Khởi động tất cả services (Postgres + Backend + Frontend)
docker compose up -d

# Xem logs
docker compose logs -f

# Dừng services
docker compose down
```

**URLs:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

**Tài khoản demo:**

- Admin: `admin@todo.local` / `Admin@123`
- User: `user@todo.local` / `Pass@123`

### B. Chạy local (Thủ công)

#### 1. Khởi động Database

```bash
# PostgreSQL (mặc định)
docker run -d \
  --name todo-db \
  -e POSTGRES_DB=tododb \
  -e POSTGRES_USER=todouser \
  -e POSTGRES_PASSWORD=todopass \
  -p 5432:5432 \
  postgres:15-alpine
```

Hoặc dùng MySQL:

```bash
docker run -d \
  --name todo-db \
  -e MYSQL_DATABASE=tododb \
  -e MYSQL_USER=todouser \
  -e MYSQL_PASSWORD=todopass \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -p 3306:3306 \
  mysql:8
```

#### 2. Chạy Backend

```bash
cd backend

# Build
./gradlew build

# Chạy (dev profile)
./gradlew bootRun --args='--spring.profiles.active=dev'

# Hoặc chạy JAR
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

**Yêu cầu:**

- Java 17+
- Gradle 8+

**Biến môi trường (optional):**

```bash
export DB_URL=jdbc:postgresql://localhost:5432/tododb
export DB_USERNAME=todouser
export DB_PASSWORD=todopass
export JWT_SECRET=your-secret-key-change-in-production-min-256-bits
export JWT_EXP_MIN=60
export REFRESH_EXP_MIN=10080
```

#### 3. Chạy Frontend

```bash
cd frontend

# Cài dependencies
pnpm install
# hoặc: npm install

# Chạy dev server
pnpm dev
# hoặc: npm run dev
```

**Yêu cầu:**

- Node.js 18+
- pnpm (hoặc npm/yarn)

**File `.env`:**

```env
VITE_API_URL=http://localhost:8080
```

## 📚 API Documentation

### Swagger UI (Interactive)

Truy cập Swagger UI để test API trực tiếp:

**URL:** http://localhost:8080/swagger-ui.html

Swagger UI cung cấp:
- Danh sách tất cả endpoints
- Schemas và models
- Try-it-out feature để test ngay trên browser
- Response examples

### OpenAPI Specification

**JSON:** http://localhost:8080/v3/api-docs  
**YAML:** http://localhost:8080/v3/api-docs.yaml

Sử dụng để:
- Generate client SDKs
- Import vào Postman/Insomnia
- Generate documentation

### Postman Collection

**Import vào Postman:**

1. Mở Postman
2. Click **Import** → **Upload Files**
3. Chọn file `postman/todo-app.postman_collection.json`
4. Import environment: `postman/todo-app.postman_environment.json`

**Sử dụng:**

1. Chọn environment "Todo App - Development"
2. Gọi endpoint **Login** để lấy tokens (tự động lưu vào environment)
3. Các request khác tự động inject token từ environment
4. Tokens tự động refresh và lưu sau mỗi login/refresh

**Collection bao gồm:**
- ✅ Authentication (Register, Login, Refresh, Logout)
- ✅ Users (Profile, Update, Change Password)
- ✅ Todos (CRUD, Search, Subtasks, Status, Trash/Restore)
- ✅ Categories (CRUD)
- ✅ Tags (CRUD)

Mỗi request có:
- Pre-request scripts (auto inject token)
- Tests (auto save tokens)
- Example responses
- Descriptions

## 🛠️ Scripts tiện ích

### Windows

```bash
# Khởi động full stack (DB + Backend + Frontend)
scripts\DEV_START.bat
```

### Development Commands

**Backend:**

```bash
cd backend
./gradlew clean build          # Build
./gradlew test                 # Run tests
./gradlew bootRun              # Run application
./gradlew bootJar              # Build JAR
```

**Frontend:**

```bash
cd frontend
pnpm dev                       # Dev server
pnpm build                     # Production build
pnpm preview                   # Preview production build
pnpm lint                      # Lint code
pnpm format                    # Format code
```

## 🗄️ Database

### PostgreSQL (Mặc định)

```yaml
Host: localhost
Port: 5432
Database: tododb
User: todouser
Password: todopass
```

### MySQL (Alternative)

Sửa `application.yml` và uncomment MySQL config, sau đó:

```bash
docker compose --profile mysql up -d
```

## 📊 Database Schema

Flyway migrations tự động chạy khi start backend:

- `V1__init.sql`: Tạo schema (users, todos, categories, tags, attachments)
- `V2__seed.sql`: Data mẫu (users, categories, tags, todos)

## 🔒 Security

- JWT với access token (60 min) và refresh token (7 days)
- Refresh token rotation
- Password hashing với BCrypt
- Rate limiting cho authentication endpoints
- Email verification (mock)

## 🧪 Testing

**Backend:**

```bash
cd backend
./gradlew test                      # Unit tests
./gradlew integrationTest           # Integration tests (Testcontainers)
```

**Frontend:**

```bash
cd frontend
pnpm test                           # Run tests
```

## 📦 Build Production

### Docker

```bash
# Build images
docker compose build

# Run production
docker compose up -d
```

### Manual

**Backend:**

```bash
cd backend
./gradlew bootJar
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

**Frontend:**

```bash
cd frontend
pnpm build
# Serve từ folder dist/ bằng nginx hoặc serve
```

## 🌐 Profiles

**Backend:**

- `dev`: Development (console logging, H2/Postgres local)
- `prod`: Production (file logging, external DB)

**Frontend:**

- `.env.development`: Local dev
- `.env.production`: Production build

## 📝 API Endpoints Summary

| Endpoint             | Method   | Description        | Auth |
| -------------------- | -------- | ------------------ | ---- |
| `/api/auth/register` | POST     | Đăng ký            | ❌   |
| `/api/auth/login`    | POST     | Đăng nhập          | ❌   |
| `/api/auth/refresh`  | POST     | Refresh token      | ❌   |
| `/api/auth/logout`   | POST     | Đăng xuất          | ✅   |
| `/api/users/me`      | GET      | Thông tin user     | ✅   |
| `/api/todos`         | GET      | Danh sách todos    | ✅   |
| `/api/todos`         | POST     | Tạo todo           | ✅   |
| `/api/todos/{id}`    | PUT      | Cập nhật todo      | ✅   |
| `/api/todos/{id}`    | DELETE   | Xóa todo (soft)    | ✅   |
| `/api/todos/search`  | GET      | Tìm kiếm & filter  | ✅   |
| `/api/categories`    | GET/POST | Quản lý categories | ✅   |
| `/api/tags`          | GET/POST | Quản lý tags       | ✅   |

## 🔧 Troubleshooting

### 1. Port đã được sử dụng

**Triệu chứng:** Error "Address already in use" hoặc "Port 8080/3000/5432 is already allocated"

**Giải pháp:**

```bash
# Windows - Tìm và kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Hoặc kill tất cả Java processes
taskkill /F /IM java.exe

# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Hoặc thay đổi port trong config
# Backend: application.yml → server.port: 8081
# Frontend: vite.config.ts → server.port: 3001
```

### 2. Database connection failed

**Triệu chứng:** 
- "Connection refused" 
- "Could not connect to database"
- Backend crash khi start

**Giải pháp:**

```bash
# Kiểm tra container đang chạy
docker ps

# Nếu không có container, start lại
docker start todo-db

# Nếu container không tồn tại, tạo mới
docker run -d --name todo-db \
  -e POSTGRES_DB=tododb \
  -e POSTGRES_USER=todouser \
  -e POSTGRES_PASSWORD=todopass \
  -p 5432:5432 \
  postgres:15-alpine

# Kiểm tra logs
docker logs todo-db

# Test connection
docker exec -it todo-db psql -U todouser -d tododb
```

**Checklist:**
- ✅ Container đang chạy: `docker ps`
- ✅ Port 5432 không bị chiếm: `netstat -ano | findstr :5432`
- ✅ Credentials đúng trong `application.yml`
- ✅ Database URL đúng: `jdbc:postgresql://localhost:5432/tododb`

### 3. Frontend không kết nối được Backend

**Triệu chứng:**
- API calls fail với "Network Error"
- CORS errors trong console
- 404 Not Found

**Giải pháp:**

```bash
# 1. Kiểm tra Backend đang chạy
curl http://localhost:8080/actuator/health

# 2. Kiểm tra VITE_API_URL
# File: frontend/.env
VITE_API_URL=http://localhost:8080

# 3. Restart frontend
cd frontend
npm run dev
```

**Checklist:**
- ✅ Backend running: http://localhost:8080/actuator/health
- ✅ CORS enabled trong `SecurityConfig.java`
- ✅ `.env` file exists với correct `VITE_API_URL`
- ✅ Clear browser cache và reload

### 4. Gradlew build failed

**Triệu chứng:**
- "Could not find tools.jar"
- "Unsupported class file major version"
- Compilation errors

**Giải pháp:**

```bash
# Kiểm tra Java version (phải >= 17)
java -version
javac -version

# Set JAVA_HOME (Windows)
set JAVA_HOME=C:\Program Files\Java\jdk-17

# Clean và rebuild
cd backend
./gradlew clean build --refresh-dependencies

# Skip tests nếu cần
./gradlew clean build -x test
```

### 5. Docker Compose issues

**Triệu chứng:**
- Services không start
- Containers exit immediately
- Network errors

**Giải pháp:**

```bash
# Stop tất cả
docker compose down

# Remove volumes (XÓA DỮ LIỆU!)
docker compose down -v

# Rebuild images
docker compose build --no-cache

# Start lại với logs
docker compose up

# Check container health
docker compose ps
docker compose logs backend
docker compose logs frontend
```

### 6. Migration/Schema errors

**Triệu chứng:**
- "Table already exists"
- "Column not found"
- Flyway validation errors

**Giải pháp:**

```bash
# Option 1: Drop và recreate database (MẤT DATA!)
docker exec -it todo-db psql -U todouser -d postgres -c "DROP DATABASE tododb;"
docker exec -it todo-db psql -U todouser -d postgres -c "CREATE DATABASE tododb;"

# Option 2: Clean Flyway checksum
# Xóa table flyway_schema_history và restart

# Option 3: Sử dụng H2 database (in-memory) cho dev
# application-dev.yml → spring.datasource.url: jdbc:h2:mem:testdb
```

### 7. Authentication/JWT errors

**Triệu chứng:**
- "Token expired"
- "Invalid token"
- 401 Unauthorized

**Giải pháp:**

```bash
# 1. Login lại để lấy token mới
# 2. Kiểm tra JWT_SECRET trong environment
# 3. Check token expiry time (default 60 min)

# Debug: Decode JWT token tại https://jwt.io
```

### 8. Performance issues

**Triệu chứng:**
- Slow API responses
- High memory usage
- Timeouts

**Giải pháp:**

```bash
# Increase JVM memory
# backend: JAVA_OPTS=-Xmx2g -Xms512m

# Enable Spring Boot Actuator metrics
# http://localhost:8080/actuator/metrics

# Check database indexes
# Xem file migration có indexes chưa

# Enable query logging
# application.yml → spring.jpa.show-sql: true
```

### 🆘 Nếu vẫn gặp vấn đề

1. Check logs:
   - Backend: `backend/logs/application.log`
   - Docker: `docker compose logs -f`
   
2. Clean everything và start lại:
   ```bash
   # Clean backend
   cd backend && ./gradlew clean
   
   # Clean frontend
   cd frontend && rm -rf node_modules dist && npm install
   
   # Clean Docker
   docker compose down -v
   docker system prune -f
   ```

3. Tạo GitHub Issue với:
   - OS và version
   - Java/Node version
   - Error logs
   - Steps to reproduce

## 🤝 Contributing

Contributions are welcome! Đóng góp của bạn giúp dự án tốt hơn.

### Quy trình đóng góp

1. **Fork repository**
   ```bash
   # Click nút Fork trên GitHub
   git clone https://github.com/YOUR_USERNAME/todo-app.git
   cd todo-app
   ```

2. **Tạo branch mới**
   ```bash
   git checkout -b feature/amazing-feature
   # hoặc
   git checkout -b fix/bug-description
   ```

3. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: amazing feature"
   ```

   **Commit message format:**
   - `Add: <description>` - Thêm tính năng mới
   - `Fix: <description>` - Sửa bug
   - `Update: <description>` - Cập nhật code
   - `Refactor: <description>` - Refactor code
   - `Docs: <description>` - Cập nhật documentation
   - `Test: <description>` - Thêm/sửa tests
   - `Style: <description>` - Format code

4. **Push lên GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Tạo Pull Request**
   - Mở repository trên GitHub
   - Click "New Pull Request"
   - Mô tả changes chi tiết
   - Wait for review

### Code Style

**Backend (Java):**
- Follow Google Java Style Guide
- Use Lombok annotations
- Write Javadoc cho public methods
- Maximum line length: 120

**Frontend (TypeScript):**
- Follow Airbnb JavaScript Style Guide
- Use functional components
- Use TypeScript types (không dùng `any`)
- Run `npm run lint` trước khi commit

### Testing

**Backend:**
```bash
cd backend
./gradlew test                    # Unit tests
./gradlew integrationTest         # Integration tests
./gradlew jacocoTestReport        # Coverage report
```

**Frontend:**
```bash
cd frontend
npm run test                      # Run tests
npm run test:coverage             # Coverage report
```

Yêu cầu: Test coverage >= 70%

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Self-review of code
- [ ] Comments added (nếu cần)
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] PR title descriptive

### Báo cáo Bug

Tạo GitHub Issue với template:

**Bug Description:**
Mô tả bug ngắn gọn

**To Reproduce:**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
Mô tả hành vi mong đợi

**Screenshots:**
Nếu có

**Environment:**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Version: [1.0.0]

### Đề xuất Feature

Tạo GitHub Issue với template:

**Feature Description:**
Mô tả tính năng

**Use Case:**
Tại sao cần tính năng này?

**Proposed Solution:**
Giải pháp đề xuất

**Alternatives:**
Các phương án khác (nếu có)

## 📄 License

MIT License

Copyright (c) 2024 Todo App Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📝 Changelog

### [1.0.0] - 2024-10-20

#### Added
- ✨ JWT Authentication với Refresh Token
- ✨ User Registration & Login
- ✨ Todo CRUD với Subtasks
- ✨ Categories & Tags management
- ✨ Advanced Search & Filter
- ✨ Soft Delete & Restore
- ✨ File Attachments support
- ✨ Rate Limiting cho auth endpoints
- ✨ OpenAPI/Swagger documentation
- ✨ Docker & Docker Compose support
- ✨ Flyway database migrations
- ✨ Postman collection
- ✨ Development startup scripts
- ✨ Comprehensive README documentation

#### Backend Features
- Spring Boot 3.x + Java 17
- Spring Security + JWT
- PostgreSQL/MySQL support
- MapStruct for DTO mapping
- Lombok for boilerplate reduction
- Testcontainers for integration tests
- Health checks & Actuator
- Logging với file rotation

#### Frontend Features
- React 18 + TypeScript
- Vite build tool
- React Router v6
- Zustand state management
- Axios HTTP client
- TailwindCSS styling
- ESLint + Prettier
- Responsive design

#### DevOps
- Multi-stage Docker builds
- Docker Compose orchestration
- Health checks
- Volume persistence
- Environment-based configs

### Roadmap

#### [1.1.0] - Planned
- [ ] Real-time notifications (WebSocket)
- [ ] Email notifications
- [ ] File upload to cloud storage (S3)
- [ ] Advanced analytics dashboard
- [ ] Export todos (PDF, Excel)
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)

#### [1.2.0] - Future
- [ ] Multi-language support (i18n)
- [ ] Calendar view
- [ ] Recurring todos
- [ ] Team collaboration
- [ ] Activity logs
- [ ] API rate limiting per user
- [ ] OAuth2 login (Google, GitHub)

## 👨‍💻 Tech Stack

**Backend:**

- Java 17
- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- Flyway Migration
- PostgreSQL/MySQL
- MapStruct
- Lombok
- Bucket4j (Rate Limiting)
- Testcontainers
- Gradle Kotlin DSL

**Frontend:**

- React 18
- TypeScript
- Vite
- React Router v6
- Zustand (State Management)
- Axios
- TailwindCSS
- ESLint + Prettier

**DevOps:**

- Docker & Docker Compose
- Multi-stage builds
- Health checks
- Volume persistence
