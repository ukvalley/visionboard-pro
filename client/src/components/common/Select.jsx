import { forwardRef, useState } from 'react';
import { classNames } from '../../utils/helpers';

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  className = '',
  selectClassName = '',
  required = false,
  showSearch = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Format error message with full stop
  const formatError = (err) => {
    if (!err) return err;
    const trimmed = err.trim().replace(/\.$/, '');
    return `${trimmed}.`;
  };

  // Filter options if search is enabled
  const filteredOptions = showSearch && searchTerm
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={classNames(
            'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none',
            'dark:bg-gray-800 dark:text-white dark:border-gray-600',
            'pr-10', // Space for dropdown icon
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            selectClassName
          )}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          {...props}
        >
          <option value="">{placeholder}</option>
          {filteredOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown toggle icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={classNames(
              'w-5 h-5 text-gray-400 transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {(error || helperText) && (
        <p className={classNames(
          'mt-1 text-sm',
          error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error ? formatError(error) : helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;