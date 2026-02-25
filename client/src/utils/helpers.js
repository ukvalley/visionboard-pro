// Utility helper functions for frontend

export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (!num && num !== 0) return '-';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (value) => {
  if (!value && value !== 0) return '-';
  return `${Math.round(value)}%`;
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

export const calculateProgress = (sections) => {
  if (!sections) return 0;
  const sectionValues = Object.values(sections);
  const completed = sectionValues.filter(s => s.completed).length;
  return Math.round((completed / sectionValues.length) * 100);
};

export const getProgressColor = (progress) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getProgressTextColor = (progress) => {
  if (progress >= 80) return 'text-green-600';
  if (progress >= 50) return 'text-yellow-600';
  if (progress >= 25) return 'text-orange-600';
  return 'text-red-600';
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const sectionNames = {
  businessOverview: 'Business Overview',
  financialGoals: 'Financial Goals',
  growthStrategy: 'Growth Strategy',
  productService: 'Product/Service Plan',
  systemsToBuild: 'Systems to Build',
  teamPlan: 'Team Plan',
  brandGoals: 'Brand Goals',
  lifestyleVision: 'Lifestyle Vision'
};

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const industries = [
  'Technology',
  'E-commerce',
  'Consulting',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'Real Estate',
  'Manufacturing',
  'Retail',
  'Media & Entertainment',
  'Food & Beverage',
  'Travel & Hospitality',
  'Other'
];

export const systemTypes = [
  { id: 'crm', name: 'CRM System', description: 'Customer relationship management' },
  { id: 'sales', name: 'Sales Funnel', description: 'Lead generation and conversion' },
  { id: 'operations', name: 'Operations', description: 'Day-to-day operations' },
  { id: 'finance', name: 'Financial Tracking', description: 'Budget and expense management' },
  { id: 'hr', name: 'HR System', description: 'Team management and payroll' },
  { id: 'marketing', name: 'Marketing Automation', description: 'Campaign management' },
  { id: 'support', name: 'Customer Support', description: 'Help desk and ticketing' },
  { id: 'analytics', name: 'Analytics Dashboard', description: 'Data tracking and reporting' }
];