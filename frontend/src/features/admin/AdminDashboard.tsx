import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  ListTodo,
  CheckCircle2,
  Folder,
  Tag,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  Settings,
  Shield,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminDashboardStats } from '../../types';
import Loading from '../../components/ui/Loading';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardStats();
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchDashboardStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getDashboardStats();
      setStats(response.data);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRate = () => {
    if (!stats || stats.totalTodos === 0) return 0;
    return Math.round((stats.completedTodos / stats.totalTodos) * 100);
  };

  const getActiveUserRate = () => {
    if (!stats || stats.totalUsers === 0) return 0;
    return Math.round((stats.activeUsers / stats.totalUsers) * 100);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardStats}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có dữ liệu</h3>
            <p className="text-gray-600">Dữ liệu dashboard chưa được khởi tạo</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Tổng quan hệ thống Todo App - Cập nhật lần cuối: {lastRefresh.toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Tổng Users</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{stats.usersRegisteredToday}</span>
                  <span className="text-sm text-gray-500 ml-1">hôm nay</span>
                </div>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Users Hoạt động</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeUsers}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">{getActiveUserRate()}% tổng users</span>
                </div>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          {/* Total Todos */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Tổng Todos</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalTodos}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{stats.todosCreatedToday}</span>
                  <span className="text-sm text-gray-500 ml-1">hôm nay</span>
                </div>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <ListTodo className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </div>

          {/* Completed Todos */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Todos Hoàn thành</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.completedTodos}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{getCompletionRate()}%</span>
                  <span className="text-sm text-gray-500 ml-1">tỷ lệ hoàn thành</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-200 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inactive Users */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Users Không hoạt động</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.inactiveUsers}</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Folder className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Tag className="w-5 h-5 text-pink-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tags</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTags}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Todo Status Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <PieChart className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Phân tích trạng thái Todos</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-gray-600">Đang chờ xử lý</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{stats.pendingTodos}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({stats.totalTodos > 0 ? Math.round((stats.pendingTodos / stats.totalTodos) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                    <span className="text-gray-600">Đang thực hiện</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{stats.inProgressTodos}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({stats.totalTodos > 0 ? Math.round((stats.inProgressTodos / stats.totalTodos) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-gray-600">Hoàn thành</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{stats.completedTodos}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({stats.totalTodos > 0 ? Math.round((stats.completedTodos / stats.totalTodos) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                    <span className="text-gray-600">Đã hủy</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{stats.canceledTodos}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({stats.totalTodos > 0 ? Math.round((stats.canceledTodos / stats.totalTodos) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Tổng quan hệ thống</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Users tuần này</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{stats.usersRegisteredThisWeek}</span>
                    <TrendingUp className="w-4 h-4 text-green-600 ml-2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Users tháng này</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{stats.usersRegisteredThisMonth}</span>
                    <TrendingUp className="w-4 h-4 text-green-600 ml-2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Todos hoàn thành hôm nay</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{stats.todosCompletedToday}</span>
                    <CheckCircle2 className="w-4 h-4 text-green-600 ml-2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tỷ lệ hoàn thành</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{getCompletionRate()}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${getCompletionRate()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/admin/users" 
                className="group p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quản lý Users</h4>
                  <p className="text-sm text-gray-500">Xem và quản lý người dùng</p>
                </div>
              </Link>
              
              <Link 
                to="/admin/todos" 
                className="group p-6 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                    <ListTodo className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quản lý Todos</h4>
                  <p className="text-sm text-gray-500">Xem và quản lý todos</p>
                </div>
              </Link>
              
              <Link 
                to="/admin/categories-tags" 
                className="group p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                    <Tag className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Categories & Tags</h4>
                  <p className="text-sm text-gray-500">Quản lý danh mục và thẻ</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <div className="flex items-center justify-center">
            <Shield className="w-4 h-4 mr-2" />
            <span>Admin Dashboard - Cập nhật lần cuối: {new Date(stats.lastUpdated).toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;