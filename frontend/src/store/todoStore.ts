import { create } from 'zustand';
import type { Todo, SearchParams, Category, Tag } from '../types';

interface TodoState {
  // Todo data
  todos: Todo[];
  selectedTodo: Todo | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;

  // Filters
  filters: SearchParams;

  // Categories and Tags
  categories: Category[];
  tags: Tag[];

  // Actions for todos
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: number, todo: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  setSelectedTodo: (todo: Todo | null) => void;

  // Actions for pagination
  setPagination: (totalPages: number, totalElements: number, currentPage: number) => void;

  // Actions for filters
  setFilters: (filters: Partial<SearchParams>) => void;
  resetFilters: () => void;

  // Actions for categories and tags
  setCategories: (categories: Category[]) => void;
  setTags: (tags: Tag[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: number, tag: Partial<Tag>) => void;
  deleteTag: (id: number) => void;
}

const defaultFilters: SearchParams = {
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

export const useTodoStore = create<TodoState>((set) => ({
  // Initial state
  todos: [],
  selectedTodo: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  filters: defaultFilters,
  categories: [],
  tags: [],

  // Todo actions
  setTodos: (todos) => set({ todos }),

  addTodo: (todo) =>
    set((state) => ({
      todos: [todo, ...state.todos],
      totalElements: state.totalElements + 1,
    })),

  updateTodo: (id, updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      ),
      selectedTodo:
        state.selectedTodo?.id === id
          ? { ...state.selectedTodo, ...updatedTodo }
          : state.selectedTodo,
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
      selectedTodo: state.selectedTodo?.id === id ? null : state.selectedTodo,
      totalElements: Math.max(0, state.totalElements - 1),
    })),

  setSelectedTodo: (todo) => set({ selectedTodo: todo }),

  // Pagination actions
  setPagination: (totalPages, totalElements, currentPage) =>
    set({ totalPages, totalElements, currentPage }),

  // Filter actions
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  // Category actions
  setCategories: (categories) => set({ categories }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (id, updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updatedCategory } : category
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    })),

  // Tag actions
  setTags: (tags) => set({ tags }),

  addTag: (tag) =>
    set((state) => ({
      tags: [...state.tags, tag],
    })),

  updateTag: (id, updatedTag) =>
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, ...updatedTag } : tag
      ),
    })),

  deleteTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    })),
}));

