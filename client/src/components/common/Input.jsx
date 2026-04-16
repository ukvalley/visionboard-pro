import { forwardRef, useState } from 'react';
import { classNames } from '../../utils/helpers';

const Input = forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  inputClassName = '',
  required = false,
  minLength,
  maxLength,
  placeholder,
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  // Generate placeholder based on label if not provided
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (label) {
      // Standard placeholders based on field labels
      if (label.toLowerCase().includes('email id')) return 'Enter Email ID';
      if (label.toLowerCase().includes('contact number')) return 'Enter Contact Number';
      if (label.toLowerCase().includes('postal code')) return 'Enter Postal Code';
      if (label.toLowerCase().includes('password')) return 'Enter Password';
      if (label.toLowerCase().includes('date')) return 'DD/MM/YYYY';
      return `Enter ${label.replace('*', '').trim()}`;
    }
    return '';
  };

  // Determine input type (for password visibility toggle)
  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  // Format error message with full stop
  const formatError = (err) => {
    if (!err) return err;
    // Remove trailing full stop if present to avoid double periods
    const trimmed = err.trim().replace(/\.$/, '');
    return `${trimmed}.`;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={classNames(
            'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
            'dark:bg-gray-800 dark:text-white dark:border-gray-600',
            showPasswordToggle && type === 'password' && 'pr-10',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600',
            inputClassName
          )}
          placeholder={getPlaceholder()}
          minLength={minLength}
          maxLength={maxLength}
          {...props}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              // Hide icon (eye slash) when password is visible
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              // View icon (eye) when password is hidden
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
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

Input.displayName = 'Input';

export default Input;