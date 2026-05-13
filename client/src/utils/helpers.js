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

/**
 * Format date to DD/MM/YYYY format (consistent throughout the panel)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date in DD/MM/YYYY format
 */
export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
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

/**
 * UK English spelling conversions
 * Use these functions when displaying text to ensure British English standards
 */
export const toBritishSpelling = (text) => {
  if (!text) return text;
  return text
    .replace(/organization/gi, 'organisation')
    .replace(/Organization/gi, 'Organisation')
    .replace(/color/gi, 'colour')
    .replace(/Color/gi, 'Colour')
    .replace(/behavior/gi, 'behaviour')
    .replace(/Behavior/gi, 'Behaviour')
    .replace(/favorite/gi, 'favourite')
    .replace(/Favorite/gi, 'Favourite')
    .replace(/center/gi, 'centre')
    .replace(/Center/gi, 'Centre')
    .replace(/analyze/gi, 'analyse')
    .replace(/Analyze/gi, 'Analyse')
    .replace(/customize/gi, 'customise')
    .replace(/Customize/gi, 'Customise')
    .replace(/optimize/gi, 'optimise')
    .replace(/Optimize/gi, 'Optimise')
    .replace(/initialize/gi, 'initialise')
    .replace(/Initialize/gi, 'Initialise')
    .replace(/canceled/gi, 'cancelled')
    .replace(/Canceled/gi, 'Cancelled')
    .replace(/honor/gi, 'honour')
    .replace(/Honor/gi, 'Honour')
    .replace(/humor/gi, 'humour')
    .replace(/Humor/gi, 'Humour')
    .replace(/license/g, 'licence') // Only lowercase as 'license' is correct for verb
    .replace(/authoriz/gi, 'authoris') // covers authorize, authorization, etc.
    .replace(/Authoriz/gi, 'Authoris');
};

/**
 * Format price with currency symbol - no space between symbol and value
 * @param {number} amount - Price amount
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted price
 */
export const formatPrice = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '-';
  const symbols = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    INR: '₹'
  };
  const symbol = symbols[currency] || currency;
  const formatted = new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
  return `${symbol}${formatted}`;
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