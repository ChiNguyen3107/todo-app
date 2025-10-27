import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface DarkModeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function DarkModeToggle({ className = '', size = 'md' }: DarkModeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3'
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`${buttonSizeClasses[size]} rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${className}`}
      title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
    >
      {isDarkMode ? (
        <Sun className={`${sizeClasses[size]} text-gray-600 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors`} />
      ) : (
        <Moon className={`${sizeClasses[size]} text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors`} />
      )}
    </button>
  );
}
