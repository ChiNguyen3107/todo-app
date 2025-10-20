import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag as TagIcon,
  Folder,
  LayoutGrid,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuthStore } from '../../store/authStore';
import { useTodoStore } from '../../store/todoStore';
import { todoApi, categoryApi, tagApi } from '../../lib/api';
import TodoFilter from './TodoFilter';
import TodoForm from './TodoForm';
import type { Todo, TodoStatus, TodoPriority } from '../../types';

type ViewMode = 'table' | 'cards';

const STATUS_CONFIG: Record<TodoStatus, { label: string; icon: typeof Circle; color: string }> = {
  PENDING: { label: 'Chờ xử lý', icon: Circle, color: 'text-gray-500' },
  IN_PROGRESS: { label: 'Đang thực hiện', icon: Clock, color: 'text-blue-500' },
  DONE: { label: 'Hoàn thành', icon: CheckCircle2, color: 'text-green-500' },
  CANCELED: { label: 'Đã hủy', icon: XCircle, color: 'text-red-500' },
};

const PRIORITY_CONFIG: Record<TodoPriority, { label: string; color: string; badge: string }> = {
  LOW: { label: 'Thấp', color: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
  MEDIUM: { label: 'Trung bình', color: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-800' },
  HIGH: { label: 'Cao', color: 'text-red-600', badge: 'bg-red-100 text-red-800' },
};

export default function TodoList() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const {
    todos,
    filters,
    totalPages,
    totalElements,
    currentPage,
    setTodos,
    setPagination,
    setFilters,
    setCategories,
    setTags,
    deleteTodo,
    updateTodo,
  } = useTodoStore();

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadTags();
    loadTodos();
  }, []);

  // Reload todos when filters change
  useEffect(() => {
    loadTodos();
  }, [filters]);

  const loadCategories = async () => {
    try {
      console.log('Loading categories...');
      const response = await categoryApi.getAll();
      console.log('Categories loaded:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTags = async () => {
    try {
      console.log('Loading tags...');
      const response = await tagApi.getAll();
      console.log('Tags loaded:', response.data);
      setTags(response.data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const response = await todoApi.search(filters);
      setTodos(response.data.content);
      setPagination(response.data.totalPages, response.data.totalElements, response.data.page);
    } catch (error) {
      console.error('Error loading todos:', error);
      showToast('Không thể tải danh sách todos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa todo này?')) {
      return;
    }

    try {
      setDeletingId(id);
      await todoApi.delete(id);
      deleteTodo(id);
      showToast('Xóa todo thành công!', 'success');
    } catch (error) {
      console.error('Error deleting todo:', error);
      showToast('Không thể xóa todo', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: number, status: TodoStatus) => {
    try {
      const response = await todoApi.updateStatus(id, status);
      updateTodo(id, response.data);
      showToast('Cập nhật trạng thái thành công!', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Không thể cập nhật trạng thái', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return '-';
    }
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Độ ưu tiên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hạn hoàn thành
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {todos.map((todo) => (
              <tr
                key={todo.id}
                onClick={() => navigate(`/todos/${todo.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{todo.title}</div>
                    {todo.description && (
                      <div className="text-sm text-gray-500 truncate max-w-md">
                        {todo.description}
                      </div>
                    )}
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {todo.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={todo.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(todo.id, e.target.value as TodoStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${STATUS_CONFIG[todo.status].color}`}
                  >
                    {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                      <option key={value} value={value}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_CONFIG[todo.priority].badge}`}>
                    {PRIORITY_CONFIG[todo.priority].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {todo.category ? (
                    <div className="flex items-center text-sm text-gray-900">
                      <Folder className="w-4 h-4 mr-1" style={{ color: todo.category.color || '#6B7280' }} />
                      {todo.category.name}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {formatDate(todo.dueDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTodo(todo);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTodo(todo.id);
                      }}
                      disabled={deletingId === todo.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      title="Xóa"
                    >
                      {deletingId === todo.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {todos.map((todo) => {
        return (
          <div
            key={todo.id}
            onClick={() => navigate(`/todos/${todo.id}`)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">
                {todo.title}
              </h3>
              <div className="flex gap-2 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTodo(todo);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(todo.id);
                  }}
                  disabled={deletingId === todo.id}
                  className="text-red-600 hover:text-red-900"
                >
                  {deletingId === todo.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {todo.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {todo.description}
              </p>
            )}

            <div className="flex items-center gap-2 mb-3">
              {(() => {
                const StatusIcon = STATUS_CONFIG[todo.status].icon;
                return <StatusIcon className={`w-4 h-4 ${STATUS_CONFIG[todo.status].color}`} />;
              })()}
              <span className="text-sm text-gray-700">{STATUS_CONFIG[todo.status].label}</span>
              <span className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${PRIORITY_CONFIG[todo.priority].badge}`}>
                {PRIORITY_CONFIG[todo.priority].label}
              </span>
            </div>

            {todo.category && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Folder className="w-4 h-4 mr-1" style={{ color: todo.category.color || '#6B7280' }} />
                {todo.category.name}
              </div>
            )}

            {todo.dueDate && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(todo.dueDate)}
              </div>
            )}

            {todo.tags && todo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {todo.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
              <p className="text-gray-600 mt-1">Chào mừng, {user?.fullName || 'User'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          {showFilter && (
            <div className="lg:col-span-1">
              <TodoFilter onFilterChange={loadTodos} />
            </div>
          )}

          {/* Main Content */}
          <div className={showFilter ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {showFilter ? 'Ẩn' : 'Hiện'} bộ lọc
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 rounded-md ${
                        viewMode === 'table'
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ListIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-2 rounded-md ${
                        viewMode === 'cards'
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Tổng: <span className="font-semibold">{totalElements}</span> todos
                </div>
              </div>
            </div>

            {/* Todo List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không có todo nào</p>
                </div>
              ) : (
                <>
                  {viewMode === 'table' ? renderTableView() : renderCardsView()}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="border-t px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Trang <span className="font-medium">{currentPage + 1}</span> / <span className="font-medium">{totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Tạo todo mới"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Modal */}
      {showCreateModal && (
        <TodoForm
          isModal
          onSuccess={() => {
            setShowCreateModal(false);
            loadTodos();
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Modal */}
      {editingTodo && (
        <TodoForm
          todo={editingTodo}
          isModal
          onSuccess={() => {
            setEditingTodo(null);
            loadTodos();
          }}
          onCancel={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}
