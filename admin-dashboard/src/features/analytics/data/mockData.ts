// Mock data with predictive analytics and service breakdowns
export const revenueData = [
  { 
    month: 'Jan', 
    revenue: 2200000, 
    totalEarnings: 2200000,
    shoeCleaning: 990000,
    laundry: 660000,
    dryCleaning: 330000,
    bookings: 1247, 
    drivers: 89, 
    growth: 18, 
    type: 'actual',
    predicted: 2400000
  },
  { 
    month: 'Feb', 
    revenue: 2350000, 
    totalEarnings: 2350000,
    shoeCleaning: 1057500,
    laundry: 705000,
    dryCleaning: 352500,
    bookings: 1380, 
    drivers: 92, 
    growth: 22, 
    type: 'actual',
    predicted: 2550000
  },
  { 
    month: 'Mar', 
    revenue: 2580000, 
    totalEarnings: 2580000,
    shoeCleaning: 1161000,
    laundry: 774000,
    dryCleaning: 387000,
    bookings: 1520, 
    drivers: 95, 
    growth: 25, 
    type: 'actual',
    predicted: 2750000
  },
  { 
    month: 'Apr', 
    revenue: 2720000, 
    totalEarnings: 2720000,
    shoeCleaning: 1224000,
    laundry: 816000,
    dryCleaning: 408000,
    bookings: 1680, 
    drivers: 98, 
    growth: 28, 
    type: 'actual',
    predicted: 2900000
  },
  { 
    month: 'May', 
    revenue: 2850000, 
    totalEarnings: 2850000,
    shoeCleaning: 1282500,
    laundry: 855000,
    dryCleaning: 427500,
    bookings: 1820, 
    drivers: 102, 
    growth: 31, 
    type: 'actual',
    predicted: 3050000
  },
  { 
    month: 'Jun', 
    revenue: 3120000, 
    totalEarnings: 3120000,
    shoeCleaning: 1404000,
    laundry: 936000,
    dryCleaning: 468000,
    bookings: 1980, 
    drivers: 108, 
    growth: 35, 
    type: 'actual',
    predicted: 3300000
  },
  { 
    month: 'Jul', 
    revenue: 3350000, 
    totalEarnings: 3350000,
    shoeCleaning: 1507500,
    laundry: 1005000,
    dryCleaning: 502500,
    bookings: 2150, 
    drivers: 115, 
    growth: 38, 
    type: 'predicted',
    predicted: 3500000
  },
  { 
    month: 'Aug', 
    revenue: 3580000, 
    totalEarnings: 3580000,
    shoeCleaning: 1611000,
    laundry: 1074000,
    dryCleaning: 537000,
    bookings: 2320, 
    drivers: 122, 
    growth: 41, 
    type: 'predicted',
    predicted: 3750000
  },
];

export const serviceCategories = [
  { name: 'Shoe Cleaning', value: 45, revenue: 1440000, color: '#FF6B35' },
  { name: 'Laundry', value: 30, revenue: 960000, color: '#00B8D9' },
  { name: 'Dry Cleaning', value: 15, revenue: 480000, color: '#9C27B0' },
  { name: 'Specialty', value: 10, revenue: 320000, color: '#4CAF50' },
];

export const driverPerformance = [
  { name: 'Sarah M.', rating: 4.9, completed: 156, earnings: 12500, status: 'active' },
  { name: 'John D.', rating: 4.8, completed: 142, earnings: 11800, status: 'active' },
  { name: 'Mike K.', rating: 4.7, completed: 138, earnings: 11200, status: 'busy' },
  { name: 'Lisa R.', rating: 4.6, completed: 125, earnings: 9800, status: 'offline' },
];

export const hourlyBookings = [
  { hour: '6AM', bookings: 12, revenue: 2400 },
  { hour: '8AM', bookings: 28, revenue: 5600 },
  { hour: '10AM', bookings: 45, revenue: 9000 },
  { hour: '12PM', bookings: 52, revenue: 10400 },
  { hour: '2PM', bookings: 38, revenue: 7600 },
  { hour: '4PM', bookings: 41, revenue: 8200 },
  { hour: '6PM', bookings: 35, revenue: 7000 },
  { hour: '8PM', bookings: 22, revenue: 4400 },
];

export const weeklyTrends = [
  { day: 'Mon', bookings: 45, drivers: 89, satisfaction: 4.7 },
  { day: 'Tue', bookings: 52, drivers: 92, satisfaction: 4.8 },
  { day: 'Wed', bookings: 48, drivers: 88, satisfaction: 4.6 },
  { day: 'Thu', bookings: 55, drivers: 95, satisfaction: 4.9 },
  { day: 'Fri', bookings: 62, drivers: 98, satisfaction: 4.8 },
  { day: 'Sat', bookings: 58, drivers: 85, satisfaction: 4.7 },
  { day: 'Sun', bookings: 42, drivers: 78, satisfaction: 4.5 },
];
