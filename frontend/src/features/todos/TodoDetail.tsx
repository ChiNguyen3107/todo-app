import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TodoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/todos')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Chi tiết Todo #{id}
          </h1>
          <p className="text-gray-600">
            Todo Detail component sẽ được triển khai trong phần tiếp theo.
          </p>
        </div>
      </div>
    </div>
  );
}

