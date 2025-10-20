import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  User,
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  Subtask,
  CreateSubtaskRequest,
  UpdateSubtaskRequest,
  Attachment,
  SearchParams,
  PageResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - inject access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // No refresh token, redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<AuthResponse>(
          `${API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  refreshToken: (data: RefreshTokenRequest) =>
    apiClient.post<AuthResponse>('/auth/refresh-token', data),

  logout: () => apiClient.post('/auth/logout'),

  getCurrentUser: () => apiClient.get<User>('/auth/me'),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post('/auth/change-password', data),

  requestPasswordReset: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),

  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),

  resendVerificationEmail: () =>
    apiClient.post('/auth/resend-verification'),
};

// Todo API
export const todoApi = {
  search: (params: SearchParams) =>
    apiClient.get<PageResponse<Todo>>('/todos/search', { params }),

  getById: (id: number) => apiClient.get<Todo>(`/todos/${id}`),

  create: (data: CreateTodoRequest) =>
    apiClient.post<Todo>('/todos', data),

  update: (id: number, data: UpdateTodoRequest) =>
    apiClient.put<Todo>(`/todos/${id}`, data),

  delete: (id: number) => apiClient.delete(`/todos/${id}`),

  updateStatus: (id: number, status: string) =>
    apiClient.patch<Todo>(`/todos/${id}/status`, { status }),

  addTags: (id: number, tagIds: number[]) =>
    apiClient.post<Todo>(`/todos/${id}/tags`, { tagIds }),

  removeTag: (todoId: number, tagId: number) =>
    apiClient.delete(`/todos/${todoId}/tags/${tagId}`),

  // Subtasks
  getSubtasks: (todoId: number) =>
    apiClient.get<Subtask[]>(`/todos/${todoId}/subtasks`),

  createSubtask: (todoId: number, data: CreateSubtaskRequest) =>
    apiClient.post<Subtask>(`/todos/${todoId}/subtasks`, data),

  updateSubtask: (todoId: number, subtaskId: number, data: UpdateSubtaskRequest) =>
    apiClient.put<Subtask>(`/todos/${todoId}/subtasks/${subtaskId}`, data),

  deleteSubtask: (todoId: number, subtaskId: number) =>
    apiClient.delete(`/todos/${todoId}/subtasks/${subtaskId}`),

  toggleSubtask: (todoId: number, subtaskId: number) =>
    apiClient.patch<Subtask>(`/todos/${todoId}/subtasks/${subtaskId}/toggle`),

  // Attachments
  getAttachments: (todoId: number) =>
    apiClient.get<Attachment[]>(`/todos/${todoId}/attachments`),

  uploadAttachment: (todoId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<Attachment>(`/todos/${todoId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteAttachment: (todoId: number, attachmentId: number) =>
    apiClient.delete(`/todos/${todoId}/attachments/${attachmentId}`),

  downloadAttachment: (todoId: number, attachmentId: number) =>
    apiClient.get(`/todos/${todoId}/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    }),
};

// Category API
export const categoryApi = {
  getAll: () => apiClient.get<Category[]>('/categories'),

  getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),

  create: (data: CreateCategoryRequest) =>
    apiClient.post<Category>('/categories', data),

  update: (id: number, data: UpdateCategoryRequest) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: number) => apiClient.delete(`/categories/${id}`),
};

// Tag API
export const tagApi = {
  getAll: () => apiClient.get<Tag[]>('/tags'),

  getById: (id: number) => apiClient.get<Tag>(`/tags/${id}`),

  create: (data: CreateTagRequest) =>
    apiClient.post<Tag>('/tags', data),

  update: (id: number, data: UpdateTagRequest) =>
    apiClient.put<Tag>(`/tags/${id}`, data),

  delete: (id: number) => apiClient.delete(`/tags/${id}`),
};

export default apiClient;

