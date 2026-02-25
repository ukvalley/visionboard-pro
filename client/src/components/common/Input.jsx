import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

const Input = forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={classNames(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
          'dark:bg-gray-800 dark:text-white dark:border-gray-600',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600',
          inputClassName
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={classNames(
          'mt-1 text-sm',
          error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;