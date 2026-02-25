// AI Suggestions utility for frontend display

export const getIconComponent = (iconName) => {
  const icons = {
    'users': '👥',
    'cog': '⚙️',
    'dollar-sign': '💵',
    'clock': '⏰',
    'trending-up': '📈',
    'trending-down': '📉',
    'target': '🎯',
    'bar-chart': '📊',
    'shield': '🛡️',
    'pie-chart': '🥧'
  };
  return icons[iconName] || '💡';
};

export const getTypeColor = (type) => {
  const colors = {
    'warning': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: 'text-yellow-500' },
    'recommendation': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-500' },
    'alert': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500' },
    'info': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', icon: 'text-gray-500' },
    'success': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-500' }
  };
  return colors[type] || colors['info'];
};

export const getPriorityLabel = (priority) => {
  const labels = {
    'high': { text: 'High Priority', color: 'bg-red-100 text-red-700' },
    'medium': { text: 'Medium Priority', color: 'bg-yellow-100 text-yellow-700' },
    'low': { text: 'Low Priority', color: 'bg-green-100 text-green-700' }
  };
  return labels[priority] || labels['medium'];
};

export default { getIconComponent, getTypeColor, getPriorityLabel };