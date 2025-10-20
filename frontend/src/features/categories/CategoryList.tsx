import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Check,
  X,
  Edit2,
  GripVertical,
  Folder,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { categoryApi } from '../../lib/api';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types';

const DEFAULT_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
];

export default function CategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(DEFAULT_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      showToast('Không thể tải danh sách danh mục', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const data: CreateCategoryRequest = {
        name: newCategoryName.trim(),
        color: newCategoryColor,
      };
      const response = await categoryApi.create(data);
      setCategories([...categories, response.data]);
      setNewCategoryName('');
      setNewCategoryColor(DEFAULT_COLORS[0]);
      setShowAddForm(false);
      showToast('Thêm danh mục thành công!', 'success');
    } catch (error) {
      console.error('Error creating category:', error);
      showToast('Không thể thêm danh mục', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingColor(category.color || DEFAULT_COLORS[0]);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const data: UpdateCategoryRequest = {
        name: editingName.trim(),
        color: editingColor,
      };
      const response = await categoryApi.update(editingId, data);
      setCategories(
        categories.map((cat) => (cat.id === editingId ? response.data : cat))
      );
      setEditingId(null);
      showToast('Cập nhật danh mục thành công!', 'success');
    } catch (error) {
      console.error('Error updating category:', error);
      showToast('Không thể cập nhật danh mục', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingColor('');
  };

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?\nTất cả các todo trong danh mục này sẽ không còn danh mục.`
      )
    ) {
      return;
    }

    try {
      await categoryApi.delete(category.id);
      setCategories(categories.filter((cat) => cat.id !== category.id));
      showToast('Xóa danh mục thành công!', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Không thể xóa danh mục', 'error');
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);

    setCategories(newCategories);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple toast notification (you can enhance this with a proper toast library)
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
          <p className="text-gray-600">Đang tải danh sách danh mục...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Folder className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Danh mục</h1>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Add Category Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thêm danh mục mới
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nhập tên danh mục..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    {DEFAULT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          newCategoryColor === color
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
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
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
                    setNewCategoryName('');
                    setNewCategoryColor(DEFAULT_COLORS[0]);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim() || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Thêm danh mục
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có danh mục nào
              </h3>
              <p className="text-gray-600 mb-4">
                Tạo danh mục đầu tiên để tổ chức các todo của bạn
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Thêm danh mục
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Drag Handle */}
                    <div className="cursor-move text-gray-400 hover:text-gray-600">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    {/* Color Indicator */}
                    {editingId === category.id ? (
                      <input
                        type="color"
                        value={editingColor}
                        onChange={(e) => setEditingColor(e.target.value)}
                        className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: category.color || DEFAULT_COLORS[0] }}
                      />
                    )}

                    {/* Name */}
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    ) : (
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleStartEdit(category)}
                      >
                        <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Tạo lúc: {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={!editingName.trim() || isSubmitting}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSubmitting}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        {categories.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>💡 Mẹo: Kéo và thả để sắp xếp lại thứ tự các danh mục</p>
            <p className="mt-1">
              Click vào tên danh mục hoặc nút <Edit2 className="h-4 w-4 inline" /> để chỉnh sửa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
