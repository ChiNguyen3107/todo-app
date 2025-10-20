// User Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
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

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
}

// Tag Types
export interface Tag {
  id: number;
  name: string;
  color?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

// Attachment Types
export interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  todoId: number;
  uploadedAt: string;
}

// Todo Types
export type TodoStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
export type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  completedAt?: string;
  userId: number;
  category?: Category;
  tags?: Tag[];
  subtasks?: Subtask[];
  attachments?: Attachment[];
  subtasksCount?: number;
  attachmentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string;
  categoryId?: number;
  tagIds?: number[];
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string;
  categoryId?: number;
}

// Subtask Types
export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  todoId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubtaskRequest {
  title: string;
}

export interface UpdateSubtaskRequest {
  title?: string;
  completed?: boolean;
}

// Search and Filter Types
export interface SearchParams {
  keyword?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  categoryId?: number;
  tagIds?: number[];
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Admin Types
export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  inProgressTodos: number;
  canceledTodos: number;
  totalCategories: number;
  totalTags: number;
  todosCreatedToday: number;
  todosCompletedToday: number;
  usersRegisteredToday: number;
  usersRegisteredThisWeek: number;
  usersRegisteredThisMonth: number;
  lastUpdated: string;
}

export interface UserManagementResponse {
  id: number;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  totalCategories: number;
  totalTags: number;
}

// API Response Types
export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

