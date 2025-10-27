import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Calendar,
  Tag as TagIcon,
  Folder,
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  Table,
  List,
  Grid3X3,
  CheckSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTodoStore } from '../../store/todoStore';
import { todoApi, categoryApi, tagApi } from '../../lib/api';
import TodoFilter from './TodoFilter';
import TodoForm from './TodoForm';
import Layout from '../../components/Layout';
import type { Todo, TodoStatus, TodoPriority } from '../../types';

type ViewMode = 'table' | 'modern' | 'cards';

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
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
      setLoading(true);
      const response = await todoApi.search(filters);
      setTodos(response.data.content);
      setPagination(response.data.totalPages, response.data.totalElements, response.data.page);
    } catch (error) {
      console.error('Error loading todos:', error);
      showToast('Không thể tải danh sách todos', 'error');
    } finally {
      setLoading(false);
    }
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
    <div className="w-full">
      <table className="w-full table-fixed">
        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <tr>
            <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tiêu đề
            </th>
            <th className="w-1/6 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
              Trạng thái
            </th>
            <th className="w-1/6 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
              Ưu tiên
            </th>
            <th className="w-1/6 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
              Danh mục
            </th>
            <th className="w-1/6 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden xl:table-cell">
              Hạn hoàn thành
            </th>
            <th className="w-1/6 px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {todos.map((todo) => (
              <tr
                key={todo.id}
                onClick={() => navigate(`/todos/${todo.id}`)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{todo.title}</div>
                    {todo.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {todo.description}
                      </div>
                    )}
                    {/* Mobile info - hiển thị trên màn hình nhỏ */}
                    <div className="flex items-center gap-2 mt-1 sm:hidden">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_CONFIG[todo.priority].badge}`}>
                        {PRIORITY_CONFIG[todo.priority].label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{STATUS_CONFIG[todo.status].label}</span>
                    </div>
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {todo.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {todo.tags.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">+{todo.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap hidden sm:table-cell">
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
                <td className="px-2 py-3 whitespace-nowrap hidden md:table-cell">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_CONFIG[todo.priority].badge}`}>
                    {PRIORITY_CONFIG[todo.priority].label}
                  </span>
                </td>
                <td className="px-2 py-3 whitespace-nowrap hidden lg:table-cell">
                  {todo.category ? (
                    <div className="flex items-center text-xs text-gray-900 dark:text-gray-100">
                      <Folder className="w-3 h-3 mr-1 flex-shrink-0" style={{ color: todo.category.color || '#6B7280' }} />
                      <span className="truncate">{todo.category.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="px-2 py-3 whitespace-nowrap hidden xl:table-cell">
                  <div className="flex items-center text-xs text-gray-900 dark:text-gray-100">
                    <Calendar className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="truncate">{formatDate(todo.dueDate)}</span>
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTodo(todo);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTodo(todo.id);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Xóa"
                    >
                        <Trash2 className="w-4 h-4" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {todos.map((todo) => (
          <div
            key={todo.id}
            onClick={() => navigate(`/todos/${todo.id}`)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex-1 truncate">
                {todo.title}
              </h3>
            <div className="flex gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTodo(todo);
                  }}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(todo.id);
                  }}
                  disabled={deletingId === todo.id}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {todo.description}
              </p>
            )}

            <div className="flex items-center gap-2 mb-3">
              {(() => {
                const StatusIcon = STATUS_CONFIG[todo.status].icon;
                return <StatusIcon className={`w-4 h-4 ${STATUS_CONFIG[todo.status].color}`} />;
              })()}
            <span className="text-sm text-gray-700 dark:text-gray-300">{STATUS_CONFIG[todo.status].label}</span>
              <span className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${PRIORITY_CONFIG[todo.priority].badge}`}>
                {PRIORITY_CONFIG[todo.priority].label}
              </span>
            </div>

            {todo.category && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Folder className="w-4 h-4 mr-1 flex-shrink-0" style={{ color: todo.category.color || '#6B7280' }} />
              <span className="truncate">{todo.category.name}</span>
              </div>
            )}

            {todo.dueDate && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
              <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{formatDate(todo.dueDate)}</span>
              </div>
            )}

            {todo.tags && todo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
              {todo.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag.name}
                </span>
              ))}
              {todo.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                  +{todo.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderModernListView = () => (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div
          key={todo.id}
          onClick={() => navigate(`/todos/${todo.id}`)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                {/* Priority Indicator */}
                <div className={`w-1 h-12 rounded-full ${PRIORITY_CONFIG[todo.priority].badge.replace('text-', 'bg-').replace('-600', '-500')} flex-shrink-0`}></div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {todo.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_CONFIG[todo.priority].badge}`}>
                      {PRIORITY_CONFIG[todo.priority].label}
                    </span>
                  </div>
                  
                  {todo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {todo.description}
                    </p>
                  )}
                  
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {/* Status */}
                    <div className="flex items-center gap-1">
                      {(() => {
                        const StatusIcon = STATUS_CONFIG[todo.status].icon;
                        return <StatusIcon className={`w-3 h-3 ${STATUS_CONFIG[todo.status].color}`} />;
                      })()}
                      <span>{STATUS_CONFIG[todo.status].label}</span>
                    </div>
                    
                    {/* Category */}
                    {todo.category && (
                      <div className="flex items-center gap-1">
                        <Folder className="w-3 h-3" style={{ color: todo.category.color || '#6B7280' }} />
                        <span className="truncate">{todo.category.name}</span>
                      </div>
                    )}
                    
                    {/* Due Date */}
                    {todo.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(todo.dueDate)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {todo.tags && todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {todo.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                          className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag.name}
                  </span>
                ))}
                      {todo.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                          +{todo.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTodo(todo);
                }}
                className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
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
                className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Xóa"
              >
                {deletingId === todo.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          {showFilter && (
            <div className="xl:col-span-1 order-2 xl:order-1">
              <TodoFilter onFilterChange={loadTodos} />
            </div>
          )}

          {/* Main Content */}
          <div className={`${showFilter ? 'xl:col-span-3' : 'xl:col-span-4'} order-1 xl:order-2`}>
            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {showFilter ? 'Ẩn' : 'Hiện'} bộ lọc
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'table'
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Chế độ bảng"
                    >
                      <Table className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('modern')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'modern'
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Chế độ danh sách hiện đại"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'cards'
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Chế độ thẻ"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng: <span className="font-semibold">{totalElements}</span> todos
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-primary-400" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <CheckSquare className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Chưa có todo nào</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Hãy tạo todo đầu tiên của bạn!</p>
                  <button
                    onClick={() => setEditingTodo({} as Todo)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Tạo todo
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  {viewMode === 'table' && renderTableView()}
                  {viewMode === 'cards' && renderCardsView()}
                  {viewMode === 'modern' && renderModernListView()}
                </div>
              )}
            </div>

            {/* Pagination */}
            {todos.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalElements)} trong {totalElements} todo
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </Layout>
  );
}
