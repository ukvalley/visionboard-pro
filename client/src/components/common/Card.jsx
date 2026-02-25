import { classNames } from '../../utils/helpers';

const Card = ({
  children,
  className = '',
  padding = true,
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <div
      className={classNames(
        'relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50',
        padding && 'p-6',
        hover && 'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 cursor-pointer hover:-translate-y-0.5',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={classNames('mb-4', className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={classNames('text-lg font-semibold text-gray-900 dark:text-white', className)}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={classNames('text-sm text-gray-500 dark:text-gray-400 mt-1', className)}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={classNames('mt-4 pt-4 border-t border-gray-100 dark:border-gray-700', className)}>
    {children}
  </div>
);

export default Card;