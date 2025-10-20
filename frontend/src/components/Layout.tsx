import { type ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex">
        {/* Sidebar - Optional */}
        {showSidebar && (
          <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Bộ lọc nhanh</h3>
              
              {/* Quick Filters */}
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
                  📋 Tất cả công việc
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
                  ⏳ Đang thực hiện
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
                  ✅ Hoàn thành
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
                  📅 Hôm nay
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
                  ⭐ Ưu tiên cao
                </button>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-200"></div>

              {/* Categories */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Danh mục</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-600">
                  🏢 Công việc
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-600">
                  🏠 Cá nhân
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-600">
                  🎯 Mục tiêu
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Footer - Optional */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2025 Todo App. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Hướng dẫn
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Hỗ trợ
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Chính sách
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

