import { useState, useEffect } from 'react';
import { X, Search, Calendar, Filter as FilterIcon } from 'lucide-react';
import { useTodoStore } from '../../store/todoStore';
import type { SearchParams, TodoStatus, TodoPriority } from '../../types';

interface TodoFilterProps {
  onFilterChange?: (filters: SearchParams) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'IN_PROGRESS', label: 'Đang thực hiện' },
  { value: 'DONE', label: 'Hoàn thành' },
  { value: 'CANCELED', label: 'Đã hủy' },
];

const PRIORITY_OPTIONS: { value: TodoPriority; label: string; color: string }[] = [
  { value: 'LOW', label: 'Thấp', color: 'text-blue-600' },
  { value: 'MEDIUM', label: 'Trung bình', color: 'text-yellow-600' },
  { value: 'HIGH', label: 'Cao', color: 'text-red-600' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Ngày tạo' },
  { value: 'updatedAt', label: 'Ngày cập nhật' },
  { value: 'dueDate', label: 'Hạn hoàn thành' },
  { value: 'priority', label: 'Độ ưu tiên' },
];

export default function TodoFilter({ onFilterChange, isOpen = true, onClose }: TodoFilterProps) {
  const { filters, categories, tags, setFilters, resetFilters } = useTodoStore();
  
  const [localFilters, setLocalFilters] = useState<SearchParams>(filters);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  // Debounce search
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(() => {
      handleApplyFilters();
    }, 500);

    setSearchDebounce(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [localFilters.keyword]);

  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, keyword: value || undefined }));
  };

  const handleStatusToggle = (status: TodoStatus) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status === status ? undefined : status,
    }));
  };

  const handlePriorityToggle = (priority: TodoPriority) => {
    setLocalFilters(prev => ({
      ...prev,
      priority: prev.priority === priority ? undefined : priority,
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    }));
  };

  const handleTagsChange = (tagId: number) => {
    setLocalFilters(prev => {
      const currentTags = prev.tagIds || [];
      const isSelected = currentTags.includes(tagId);
      
      return {
        ...prev,
        tagIds: isSelected
          ? currentTags.filter(id => id !== tagId)
          : [...currentTags, tagId],
      };
    });
  };

  const handleDateChange = (field: 'dueDateFrom' | 'dueDateTo', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setLocalFilters(prev => ({
      ...prev,
      sortBy: sortBy as SearchParams['sortBy'],
    }));
  };

  const handleSortDirectionToggle = () => {
    setLocalFilters(prev => ({
      ...prev,
      sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    if (onFilterChange) {
      onFilterChange(localFilters);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters: SearchParams = {
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };
    setLocalFilters(defaultFilters);
    resetFilters();
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FilterIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bộ lọc</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={localFilters.keyword || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Trạng thái
        </label>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.status === option.value}
                onChange={() => handleStatusToggle(option.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Độ ưu tiên
        </label>
        <div className="space-y-2">
          {PRIORITY_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.priority === option.value}
                onChange={() => handlePriorityToggle(option.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-blue-500"
              />
              <span className={`ml-2 text-sm font-medium ${option.color}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Danh mục
        </label>
        <select
          value={localFilters.categoryId || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có tag nào</p>
          ) : (
            tags.map((tag) => (
              <label key={tag.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.tagIds?.includes(tag.id) || false}
                  onChange={() => handleTagsChange(tag.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{tag.name}</span>
                {tag.color && (
                  <span
                    className="ml-auto w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                )}
              </label>
            ))
          )}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Hạn hoàn thành
        </label>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Từ ngày</label>
            <input
              type="date"
              value={localFilters.dueDateFrom || ''}
              onChange={(e) => handleDateChange('dueDateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Đến ngày</label>
            <input
              type="date"
              value={localFilters.dueDateTo || ''}
              onChange={(e) => handleDateChange('dueDateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sắp xếp theo
        </label>
        <div className="space-y-2">
          <select
            value={localFilters.sortBy || 'createdAt'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSortDirectionToggle}
            className="w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {localFilters.sortDirection === 'asc' ? '↑ Tăng dần' : '↓ Giảm dần'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleApplyFilters}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Áp dụng
        </button>
        <button
          onClick={handleResetFilters}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
}

