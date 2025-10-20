import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface SimpleToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const SimpleToast: React.FC<SimpleToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config: Record<
    ToastType,
    { icon: typeof Info; bgColor: string; textColor: string; borderColor: string }
  > = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
    },
  };

  const { icon: Icon, bgColor, textColor, borderColor } = config[type];

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColor} ${borderColor} animate-slideInRight max-w-md`}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm font-medium ${textColor}`}>{message}</p>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-75 transition-opacity flex-shrink-0`}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SimpleToast;
