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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200/50 mt-auto">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Todo App
                  </h3>
                  <p className="text-sm text-gray-500">Quản lý công việc thông minh</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Ứng dụng quản lý công việc hiện đại, giúp bạn tổ chức và theo dõi các nhiệm vụ một cách hiệu quả. 
                Được thiết kế với giao diện thân thiện và tính năng mạnh mẽ.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/todos" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Công việc
                  </a>
                </li>
                <li>
                  <a href="/categories" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Danh mục
                  </a>
                </li>
                <li>
                  <a href="/tags" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Thẻ tag
                  </a>
                </li>
                <li>
                  <a href="/profile" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Hồ sơ
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Hỗ trợ</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Hướng dẫn sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Liên hệ hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Báo lỗi
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200/50 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                  &copy; 2025 Todo App. Tất cả quyền được bảo lưu.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Chính sách bảo mật
                  </a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Điều khoản sử dụng
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Kết nối với chúng tôi:</span>
                <div className="flex space-x-3">
                  <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

