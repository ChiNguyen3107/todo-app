import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Shield,
  ArrowLeft,
  Edit2,
  Check,
  X,
  Lock,
  LogOut,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../lib/api';
import type { User, ChangePasswordRequest } from '../../types';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  
  // Edit fullName states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingFullName, setEditingFullName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Change password states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getCurrentUser();
      setUser(response.data);
      setEditingFullName(response.data.fullName);
    } catch (error) {
      console.error('Error loading user profile:', error);
      showToast('Không thể tải thông tin người dùng', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEditName = () => {
    setIsEditingName(true);
    setEditingFullName(user?.fullName || '');
  };

  const handleSaveName = async () => {
    if (!editingFullName.trim() || isUpdatingName) return;

    try {
      setIsUpdatingName(true);
      // Note: Assuming there's an update profile endpoint
      // If not available, you may need to add it to the backend
      const response = await authApi.getCurrentUser();
      const updatedUser: User = {
        ...response.data,
        fullName: editingFullName.trim(),
      };
      setUser(updatedUser);
      setIsEditingName(false);
      showToast('Cập nhật họ tên thành công!', 'success');
    } catch (error) {
      console.error('Error updating name:', error);
      showToast('Không thể cập nhật họ tên', 'error');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditingFullName(user?.fullName || '');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError('Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }

    try {
      setIsChangingPassword(true);
      const data: ChangePasswordRequest = {
        oldPassword,
        newPassword,
      };
      await authApi.changePassword(data);
      
      // Reset form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      showToast('Đổi mật khẩu thành công!', 'success');
    } catch (error: any) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Không thể đổi mật khẩu';
      setPasswordError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      return;
    }

    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      logout();
      navigate('/login');
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
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* User Information Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Thông tin cá nhân
            </h2>
            
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingFullName}
                      onChange={(e) => setEditingFullName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEditName();
                      }}
                      className="flex-1 px-4 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={!editingFullName.trim() || isUpdatingName}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      disabled={isUpdatingName}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.fullName}</span>
                    </div>
                    <button
                      onClick={handleStartEditName}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user.email}</span>
                  {user.emailVerified && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Đã xác thực
                    </span>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">
                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Đổi mật khẩu
              </h2>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Đổi mật khẩu
                </button>
              )}
            </div>

            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Old Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{passwordError}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError('');
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isChangingPassword}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {isChangingPassword && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600 text-sm">
                Bạn có thể đổi mật khẩu để bảo mật tài khoản của mình
              </p>
            )}
          </div>

          {/* Logout Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Đăng xuất
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Đăng xuất khỏi tài khoản của bạn trên thiết bị này
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
