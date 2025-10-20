import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import type { AdminDashboardStats } from '../../types';
import Loading from '../../components/ui/Loading';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getDashboardStats();
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Lỗi</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl">Không có dữ liệu</div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Quản lý toàn bộ hệ thống Todo App
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.usersRegisteredToday}</span>
              <span className="text-gray-500 ml-2">hôm nay</span>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Users Hoạt động</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">{stats.inactiveUsers} không hoạt động</span>
            </div>
          </div>

          {/* Total Todos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng Todos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTodos}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.todosCreatedToday}</span>
              <span className="text-gray-500 ml-2">hôm nay</span>
            </div>
          </div>

          {/* Completed Todos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Todos Hoàn thành</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedTodos}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.todosCompletedToday}</span>
              <span className="text-gray-500 ml-2">hôm nay</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Todo Status Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái Todos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-gray-600">Đang chờ</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.pendingTodos}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-600">Đang thực hiện</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.inProgressTodos}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-600">Hoàn thành</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.completedTodos}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                  <span className="text-gray-600">Đã hủy</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.canceledTodos}</span>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan hệ thống</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Categories</span>
                <span className="font-semibold text-gray-900">{stats.totalCategories}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tags</span>
                <span className="font-semibold text-gray-900">{stats.totalTags}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Users tuần này</span>
                <span className="font-semibold text-gray-900">{stats.usersRegisteredThisWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Users tháng này</span>
                <span className="font-semibold text-gray-900">{stats.usersRegisteredThisMonth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/users" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <div className="text-blue-600 text-2xl mb-2">👥</div>
                <div className="font-medium text-gray-900">Quản lý Users</div>
                <div className="text-sm text-gray-500">Xem và quản lý người dùng</div>
              </div>
            </Link>
            <Link to="/admin/todos" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <div className="text-green-600 text-2xl mb-2">📝</div>
                <div className="font-medium text-gray-900">Quản lý Todos</div>
                <div className="text-sm text-gray-500">Xem và quản lý todos</div>
              </div>
            </Link>
            <Link to="/admin/categories-tags" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <div className="text-purple-600 text-2xl mb-2">🏷️</div>
                <div className="font-medium text-gray-900">Quản lý Categories & Tags</div>
                <div className="text-sm text-gray-500">Quản lý danh mục và thẻ</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Cập nhật lần cuối: {new Date(stats.lastUpdated).toLocaleString('vi-VN')}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
