import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function TodoList() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
              <p className="text-gray-600 mt-1">Chào mừng, {user?.fullName || 'User'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Todo List component sẽ được triển khai trong phần tiếp theo.</p>
        </div>
      </div>
    </div>
  );
}

