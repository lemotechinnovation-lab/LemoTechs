export const formatCurrency = (value: number): string => {
  return `R${(value / 1000000).toFixed(1)}M ZAR`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return '#FF6B35';
    case 'busy': return '#F7931E';
    case 'offline': return '#f44336';
    default: return '#757575';
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
};
