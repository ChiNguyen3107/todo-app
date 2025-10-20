import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
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
  Plus,
  Check,
  X,
  Paperclip,
  Download,
  Upload,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTodoStore } from '../../store/todoStore';
import { todoApi } from '../../lib/api';
import TodoForm from './TodoForm';
import type { Todo, Subtask, Attachment, TodoStatus } from '../../types';

const STATUS_CONFIG: Record<TodoStatus, { label: string; icon: typeof Circle; color: string }> = {
  PENDING: { label: 'Chờ xử lý', icon: Circle, color: 'text-gray-500' },
  IN_PROGRESS: { label: 'Đang thực hiện', icon: Clock, color: 'text-blue-500' },
  DONE: { label: 'Hoàn thành', icon: CheckCircle2, color: 'text-green-500' },
  CANCELED: { label: 'Đã hủy', icon: XCircle, color: 'text-red-500' },
};

export default function TodoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateTodo, deleteTodo } = useTodoStore();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Subtask states
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');

  // Attachment states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (id) {
      loadTodoDetail(parseInt(id));
    }
  }, [id]);

  const loadTodoDetail = async (todoId: number) => {
    try {
      setIsLoading(true);
      const [todoResponse, subtasksResponse, attachmentsResponse] = await Promise.all([
        todoApi.getById(todoId),
        todoApi.getSubtasks(todoId),
        todoApi.getAttachments(todoId),
      ]);
      setTodo(todoResponse.data);
      setSubtasks(subtasksResponse.data);
      setAttachments(attachmentsResponse.data);
    } catch (error) {
      console.error('Error loading todo detail:', error);
      showToast('Không thể tải chi tiết todo', 'error');
      navigate('/todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async () => {
    if (!todo || !window.confirm('Bạn có chắc chắn muốn xóa todo này?')) {
      return;
    }

    try {
      await todoApi.delete(todo.id);
      deleteTodo(todo.id);
      showToast('Xóa todo thành công!', 'success');
      navigate('/todos');
    } catch (error) {
      console.error('Error deleting todo:', error);
      showToast('Không thể xóa todo', 'error');
    }
  };

  const handleStatusChange = async (status: TodoStatus) => {
    if (!todo) return;

    try {
      const response = await todoApi.updateStatus(todo.id, status);
      setTodo(response.data);
      updateTodo(todo.id, response.data);
      showToast('Cập nhật trạng thái thành công!', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Không thể cập nhật trạng thái', 'error');
    }
  };

  // Subtask handlers
  const handleAddSubtask = async () => {
    if (!todo || !newSubtaskTitle.trim()) return;

    try {
      setIsAddingSubtask(true);
      const response = await todoApi.createSubtask(todo.id, { title: newSubtaskTitle });
      setSubtasks([...subtasks, response.data]);
      setNewSubtaskTitle('');
      setShowAddSubtask(false);
      showToast('Thêm subtask thành công!', 'success');
    } catch (error) {
      console.error('Error adding subtask:', error);
      showToast('Không thể thêm subtask', 'error');
    } finally {
      setIsAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: number) => {
    if (!todo) return;

    try {
      const response = await todoApi.toggleSubtask(todo.id, subtaskId);
      setSubtasks(subtasks.map(st => st.id === subtaskId ? response.data : st));
    } catch (error) {
      console.error('Error toggling subtask:', error);
      showToast('Không thể cập nhật subtask', 'error');
    }
  };

  const handleUpdateSubtask = async (subtaskId: number) => {
    if (!todo || !editingSubtaskTitle.trim()) return;

    try {
      const response = await todoApi.updateSubtask(todo.id, subtaskId, { title: editingSubtaskTitle });
      setSubtasks(subtasks.map(st => st.id === subtaskId ? response.data : st));
      setEditingSubtaskId(null);
      setEditingSubtaskTitle('');
      showToast('Cập nhật subtask thành công!', 'success');
    } catch (error) {
      console.error('Error updating subtask:', error);
      showToast('Không thể cập nhật subtask', 'error');
    }
  };

  const handleDeleteSubtask = async (subtaskId: number) => {
    if (!todo || !window.confirm('Bạn có chắc chắn muốn xóa subtask này?')) return;

    try {
      await todoApi.deleteSubtask(todo.id, subtaskId);
      setSubtasks(subtasks.filter(st => st.id !== subtaskId));
      showToast('Xóa subtask thành công!', 'success');
    } catch (error) {
      console.error('Error deleting subtask:', error);
      showToast('Không thể xóa subtask', 'error');
    }
  };

  // Attachment handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!todo || !event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File không được vượt quá 10MB', 'error');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress (in real app, use axios onUploadProgress)
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await todoApi.uploadAttachment(todo.id, file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setAttachments([...attachments, response.data]);
      showToast('Upload file thành công!', 'success');
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      showToast('Không thể upload file', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadAttachment = async (attachmentId: number, fileName: string) => {
    if (!todo) return;

    try {
      const response = await todoApi.downloadAttachment(todo.id, attachmentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      showToast('Không thể tải file', 'error');
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!todo || !window.confirm('Bạn có chắc chắn muốn xóa file này?')) return;

    try {
      await todoApi.deleteAttachment(todo.id, attachmentId);
      setAttachments(attachments.filter(att => att.id !== attachmentId));
      showToast('Xóa file thành công!', 'success');
    } catch (error) {
      console.error('Error deleting attachment:', error);
      showToast('Không thể xóa file', 'error');
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
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return '-';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Todo không tồn tại</p>
      </div>
    );
  }

  const StatusIcon = STATUS_CONFIG[todo.status].icon;
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const subtaskProgress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/todos')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{todo.title}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <StatusIcon className={`w-5 h-5 mr-2 ${STATUS_CONFIG[todo.status].color}`} />
                  <select
                    value={todo.status}
                    onChange={(e) => handleStatusChange(e.target.value as TodoStatus)}
                    className="text-sm font-medium border-0 bg-transparent cursor-pointer focus:outline-none"
                  >
                    {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                      <option key={value} value={value}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  todo.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  todo.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {todo.priority === 'HIGH' ? 'Cao' : todo.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                title="Chỉnh sửa"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteTodo}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                title="Xóa"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {todo.description && (
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{todo.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {todo.category && (
              <div className="flex items-center text-sm">
                <Folder className="w-4 h-4 mr-2 text-gray-400" style={{ color: todo.category.color || undefined }} />
                <span className="text-gray-600">Danh mục:</span>
                <span className="ml-2 font-medium">{todo.category.name}</span>
              </div>
            )}
            {todo.dueDate && (
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Hạn:</span>
                <span className="ml-2 font-medium">{formatDate(todo.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Tạo lúc:</span>
              <span className="ml-2 font-medium">{formatDate(todo.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Cập nhật:</span>
              <span className="ml-2 font-medium">{formatDate(todo.updatedAt)}</span>
            </div>
          </div>

          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {todo.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Subtasks ({completedSubtasks}/{subtasks.length})
              </h2>
              {subtasks.length > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${subtaskProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAddSubtask(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm subtask
            </button>
          </div>

          {showAddSubtask && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="Nhập tiêu đề subtask..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleAddSubtask}
                  disabled={isAddingSubtask || !newSubtaskTitle.trim()}
                  className="px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAddingSubtask ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    setShowAddSubtask(false);
                    setNewSubtaskTitle('');
                  }}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {subtasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Chưa có subtask nào</p>
            ) : (
              subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md group"
                >
                  <button
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className="flex-shrink-0"
                  >
                    {subtask.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {editingSubtaskId === subtask.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingSubtaskTitle}
                        onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateSubtask(subtask.id)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateSubtask(subtask.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSubtaskId(null);
                          setEditingSubtaskTitle('');
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {subtask.title}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingSubtaskId(subtask.id);
                            setEditingSubtaskTitle(subtask.title);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubtask(subtask.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attachments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              File đính kèm ({attachments.length})
            </h2>
            <label className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer">
              <Upload className="w-4 h-4 mr-1" />
              Upload file
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>

          {isUploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Đang upload...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {attachments.length === 0 ? (
              <div className="text-center py-8">
                <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Chưa có file đính kèm</p>
              </div>
            ) : (
              attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md group"
                >
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.fileSize)} • {formatDate(attachment.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadAttachment(attachment.id, attachment.fileName)}
                      className="p-1 text-blue-600 hover:text-blue-700"
                      title="Tải xuống"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAttachment(attachment.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <TodoForm
          todo={todo}
          isModal
          onSuccess={() => {
            setShowEditModal(false);
            if (id) loadTodoDetail(parseInt(id));
          }}
          onCancel={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
