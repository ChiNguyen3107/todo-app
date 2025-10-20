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

### Swagger UI

http://localhost:8080/swagger-ui.html

### OpenAPI JSON

http://localhost:8080/v3/api-docs

### Postman Collection

Import file `postman/todo-app.postman.json` vào Postman.

Hoặc generate từ OpenAPI:

```bash
cd backend
./gradlew build
# Collection được tạo tại: build/postman/todo-app.postman.json
```

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

### Port đã được sử dụng

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Database connection failed

- Kiểm tra container DB đang chạy: `docker ps`
- Kiểm tra credentials trong `application.yml`
- Kiểm tra port 5432 (Postgres) hoặc 3306 (MySQL)

### Frontend không kết nối được Backend

- Kiểm tra `VITE_API_URL` trong `.env`
- Kiểm tra CORS config trong `SecurityConfig.java`
- Kiểm tra Backend đang chạy tại port 8080

## 📄 License

MIT License

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
