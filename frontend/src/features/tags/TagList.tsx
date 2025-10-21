import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Check,
  X,
  Edit2,
  Tag as TagIcon,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { tagApi } from '../../lib/api';
import Layout from '../../components/Layout';
import type { Tag, CreateTagRequest, UpdateTagRequest } from '../../types';

const DEFAULT_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#64748b', // slate
  '#78716c', // stone
];

export default function TagList() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(DEFAULT_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setIsLoading(true);
      const response = await tagApi.getAll();
      setTags(response.data);
    } catch (error) {
      console.error('Error loading tags:', error);
      showToast('Không thể tải danh sách tag', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const data: CreateTagRequest = {
        name: newTagName.trim(),
        color: newTagColor,
      };
      const response = await tagApi.create(data);
      setTags([...tags, response.data]);
      setNewTagName('');
      setNewTagColor(DEFAULT_COLORS[0]);
      setShowAddForm(false);
      showToast('Thêm tag thành công!', 'success');
    } catch (error) {
      console.error('Error creating tag:', error);
      showToast('Không thể thêm tag', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
    setEditingColor(tag.color || DEFAULT_COLORS[0]);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const data: UpdateTagRequest = {
        name: editingName.trim(),
        color: editingColor,
      };
      const response = await tagApi.update(editingId, data);
      setTags(tags.map((tag) => (tag.id === editingId ? response.data : tag)));
      setEditingId(null);
      showToast('Cập nhật tag thành công!', 'success');
    } catch (error) {
      console.error('Error updating tag:', error);
      showToast('Không thể cập nhật tag', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingColor('');
  };

  const handleDelete = async (tag: Tag) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa tag "${tag.name}"?\nTag này sẽ bị xóa khỏi tất cả các todo.`
      )
    ) {
      return;
    }

    try {
      await tagApi.delete(tag.id);
      setTags(tags.filter((t) => t.id !== tag.id));
      showToast('Xóa tag thành công!', 'success');
    } catch (error) {
      console.error('Error deleting tag:', error);
      showToast('Không thể xóa tag', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách tag...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/todos')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại danh sách todo
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TagIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Tag</h1>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm tag
            </button>
          </div>
        </div>

        {/* Add Tag Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thêm tag mới</h2>
            <form onSubmit={handleAddTag} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tag
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nhập tên tag..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTagColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          newTagColor === color
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center">
                    <label className="text-sm text-gray-600 mr-2">Tùy chỉnh:</label>
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTagName('');
                    setNewTagColor(DEFAULT_COLORS[0]);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newTagName.trim() || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Thêm tag
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tags Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {tags.length === 0 ? (
            <div className="py-12 text-center">
              <TagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có tag nào
              </h3>
              <p className="text-gray-600 mb-4">
                Tạo tag để dễ dàng phân loại và tìm kiếm todo
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Thêm tag
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="group relative"
                >
                  {editingId === tag.id ? (
                    // Edit Mode
                    <div className="flex items-center space-x-2 bg-gray-50 border-2 border-blue-500 rounded-lg p-2">
                      <input
                        type="color"
                        value={editingColor}
                        onChange={(e) => setEditingColor(e.target.value)}
                        className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editingName.trim() || isSubmitting}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    // Display Mode
                    <div
                      className="relative flex items-center px-4 py-2 rounded-full text-white font-medium cursor-pointer hover:shadow-lg transition-all"
                      style={{ backgroundColor: tag.color || DEFAULT_COLORS[0] }}
                    >
                      <TagIcon className="h-4 w-4 mr-2" />
                      <span>{tag.name}</span>
                      
                      {/* Action buttons (shown on hover) */}
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <button
                          onClick={() => handleStartEdit(tag)}
                          className="p-1.5 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tag)}
                          className="p-1.5 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        {tags.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>💡 Mẹo: Di chuột vào tag để hiển thị các nút chỉnh sửa và xóa</p>
            <p className="mt-1">Bạn có thể gắn nhiều tag cho một todo</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
