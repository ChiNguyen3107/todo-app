import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { useTodoStore } from '../../store/todoStore';
import { todoApi } from '../../lib/api';
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../types';

const todoSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200, 'Tiêu đề không được quá 200 ký tự'),
  description: z.string().max(1000, 'Mô tả không được quá 1000 ký tự').optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional(),
  categoryId: z.number().optional(),
  tagIds: z.array(z.number()).optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  todo?: Todo;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'IN_PROGRESS', label: 'Đang thực hiện' },
  { value: 'DONE', label: 'Hoàn thành' },
  { value: 'CANCELED', label: 'Đã hủy' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Thấp', color: 'bg-blue-100 text-blue-800' },
  { value: 'MEDIUM', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HIGH', label: 'Cao', color: 'bg-red-100 text-red-800' },
];

export default function TodoForm({ todo, onSuccess, onCancel, isModal = false }: TodoFormProps) {
  const { categories, tags, addTodo, updateTodo } = useTodoStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo?.title || '',
      description: todo?.description || '',
      status: todo?.status || 'PENDING',
      priority: todo?.priority || 'MEDIUM',
      dueDate: todo?.dueDate ? todo.dueDate.split('T')[0] : '',
      categoryId: todo?.category?.id,
      tagIds: todo?.tags?.map(tag => tag.id) || [],
    },
  });

  const selectedTagIds = watch('tagIds') || [];

  useEffect(() => {
    if (todo) {
      reset({
        title: todo.title,
        description: todo.description || '',
        status: todo.status,
        priority: todo.priority,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        categoryId: todo.category?.id,
        tagIds: todo.tags?.map(tag => tag.id) || [],
      });
    }
  }, [todo, reset]);

  const handleTagToggle = (tagId: number) => {
    const currentTags = selectedTagIds;
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    setValue('tagIds', newTags);
  };

  const onSubmit = async (data: TodoFormData) => {
    try {
      // Format date to ISO string if provided
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };

      if (todo) {
        // Update existing todo
        const response = await todoApi.update(todo.id, formattedData as UpdateTodoRequest);
        updateTodo(todo.id, response.data);
        
        // Update tags separately if changed
        if (data.tagIds && data.tagIds.length > 0) {
          await todoApi.addTags(todo.id, data.tagIds);
        }
        
        showToast('Cập nhật todo thành công!', 'success');
      } else {
        // Create new todo
        const response = await todoApi.create(formattedData as CreateTodoRequest);
        addTodo(response.data);
        showToast('Tạo todo thành công!', 'success');
      }

      if (onSuccess) {
        onSuccess();
      }
      
      if (!todo) {
        reset();
      }
    } catch (error: unknown) {
      console.error('Error saving todo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đã có lỗi xảy ra';
      showToast(errorMessage, 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple toast notification (you can replace with a proper toast library)
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

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('title')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Nhập tiêu đề todo..."
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Nhập mô tả chi tiết..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Độ ưu tiên
          </label>
          <select
            {...register('priority')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hạn hoàn thành
        </label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Danh mục
        </label>
        <select
          {...register('categoryId', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có tag nào</p>
          ) : (
            tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
              >
                {tag.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 inline mr-2" />
            Hủy
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {todo ? 'Cập nhật' : 'Tạo mới'}
            </>
          )}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {todo ? 'Chỉnh sửa Todo' : 'Tạo Todo mới'}
            </h2>
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="p-6">{formContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {todo ? 'Chỉnh sửa Todo' : 'Tạo Todo mới'}
      </h2>
      {formContent}
    </div>
  );
}

