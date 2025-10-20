import { useAuthStore } from '../../store/authStore';

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hồ sơ cá nhân</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <p className="mt-1 text-gray-900">{user?.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vai trò</label>
              <p className="mt-1 text-gray-900">{user?.role}</p>
            </div>
          </div>
          <p className="text-gray-600 mt-6">
            Profile component sẽ được triển khai đầy đủ trong phần tiếp theo.
          </p>
        </div>
      </div>
    </div>
  );
}

