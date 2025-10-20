import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: MultiSelectOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  maxDisplayed?: number;
}

export default function MultiSelect({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  fullWidth = false,
  disabled = false,
  maxDisplayed = 3,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string | number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string | number) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const baseStyles = 'block w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 cursor-pointer min-h-[42px]';
  
  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

  return (
    <div className={fullWidth ? 'w-full' : ''} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`${baseStyles} ${stateStyles} ${disabledStyles}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5 flex-1">
              {selectedOptions.length === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : (
                <>
                  {selectedOptions.slice(0, maxDisplayed).map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded"
                    >
                      {option.label}
                      {!disabled && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(option.value);
                          }}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {selectedOptions.length > maxDisplayed && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded">
                      +{selectedOptions.length - maxDisplayed}
                    </span>
                  )}
                </>
              )}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">Không có tùy chọn</div>
            ) : (
              <div className="py-1">
                {options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => !option.disabled && handleToggle(option.value)}
                      className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                        option.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm">{option.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

