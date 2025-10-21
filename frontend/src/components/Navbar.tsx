import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ListTodo,
  Folder,
  Tag,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Bell,
  Search,
  Sun,
  Moon,
  BarChart3,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Close dropdown on Escape key and click outside
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-user-menu]')) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/todos', label: 'Công việc', icon: ListTodo, color: 'blue' },
    { path: '/categories', label: 'Danh mục', icon: Folder, color: 'green' },
    { path: '/tags', label: 'Thẻ tag', icon: Tag, color: 'purple' },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3, color: 'indigo' },
    { path: '/admin/users', label: 'Quản lý User', icon: Users, color: 'blue' },
    { path: '/admin/todos', label: 'Quản lý Todo', icon: ListTodo, color: 'green' },
    { path: '/admin/categories-tags', label: 'Danh mục & Tag', icon: Tag, color: 'purple' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: isActive 
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
        : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
      green: isActive 
        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
        : 'text-green-600 hover:bg-green-50 hover:text-green-700',
      purple: isActive 
        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
        : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700',
      indigo: isActive 
        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
        : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/todos" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Todo App
                </span>
                <p className="text-xs text-gray-500 -mt-1">Quản lý công việc thông minh</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${getColorClasses(link.color, isActive(link.path))}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors group"
              title="Tìm kiếm"
            >
              <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Notifications */}
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative group"
              title="Thông báo"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors group"
              title="Chế độ tối"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
              )}
            </button>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:block relative" data-user-menu>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-sm font-bold">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-dropdownFadeIn">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg font-bold">
                          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          user?.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Profile */}
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2 transition-colors group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    {/* Admin Dashboard - Only for Admin */}
                    {user?.role === 'ADMIN' && (
                      <>
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quản trị</p>
                        </div>
                        {adminLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.path}
                              to={link.path}
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 rounded-lg mx-2 transition-colors group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Icon className="w-5 h-5 group-hover:text-purple-600 transition-colors" />
                              <span>{link.label}</span>
                            </Link>
                          );
                        })}
                      </>
                    )}

                    {/* Settings */}
                    <button
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2 w-full transition-colors group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5 group-hover:text-gray-600 transition-colors" />
                      <span>Cài đặt</span>
                    </button>

                    {/* Notifications */}
                    <button
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2 w-full transition-colors group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Bell className="w-5 h-5 group-hover:text-yellow-600 transition-colors" />
                      <span>Thông báo</span>
                    </button>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-gray-200/50 pt-2">
                    <div className="px-4 py-2 text-xs text-gray-500 mb-2">
                      Phiên đăng nhập: {new Date().toLocaleString('vi-VN')}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-2 w-full transition-colors group"
                    >
                      <LogOut className="w-5 h-5 group-hover:text-red-700 transition-colors" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 bg-white/95 backdrop-blur-md">
            {/* Mobile Search & Actions */}
            <div className="flex items-center space-x-3 px-4 mb-4">
              <button className="flex-1 flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Tìm kiếm...</span>
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${getColorClasses(link.color, isActive(link.path))}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Menu */}
            <div className="border-t border-gray-200/50 pt-4">
              <div className="px-4 py-3 mb-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      user?.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Hồ sơ cá nhân</span>
                </Link>

                {user?.role === 'ADMIN' && (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quản trị</p>
                    </div>
                    {adminLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

                <button
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl w-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Cài đặt</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}