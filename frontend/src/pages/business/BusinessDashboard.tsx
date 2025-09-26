// React and React-related imports
import { useState } from 'react';

// Third-party libraries
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  useTheme,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { 
  Business,
  Group,
  TrendingUp,
  Assessment,
  Add,
  Edit,
  Delete,
  Download,
  Search
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  monthlyLimit: number;
  currentSpend: number;
  totalBookings: number;
  status: 'active' | 'inactive';
}

interface BusinessBooking {
  id: string;
  employeeName: string;
  department: string;
  service: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
  approvedBy?: string;
}

interface DepartmentBudget {
  department: string;
  budget: number;
  spent: number;
  bookings: number;
}

export const BusinessDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  // const [selectedEmployee] = useState<Employee | null>(null);

  // Mock business data
  const [businessInfo] = useState({
    name: 'TechCorp Solutions',
    plan: 'Enterprise',
    employees: 150,
    monthlyBudget: 25000,
    currentSpend: 18750,
    locations: ['Johannesburg', 'Cape Town', 'Durban']
  });

  const [employees] = useState<Employee[]>([
    {
      id: 'E001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      department: 'Executive',
      role: 'CEO',
      monthlyLimit: 2000,
      currentSpend: 850,
      totalBookings: 12,
      status: 'active'
    },
    {
      id: 'E002',
      name: 'Michael Chen',
      email: 'michael.chen@techcorp.com',
      department: 'Sales',
      role: 'Sales Manager',
      monthlyLimit: 800,
      currentSpend: 420,
      totalBookings: 8,
      status: 'active'
    },
    {
      id: 'E003',
      name: 'Emma Williams',
      email: 'emma.williams@techcorp.com',
      department: 'Marketing',
      role: 'Marketing Director',
      monthlyLimit: 1200,
      currentSpend: 680,
      totalBookings: 15,
      status: 'active'
    }
  ]);

  const [departmentBudgets] = useState<DepartmentBudget[]>([
    { department: 'Executive', budget: 8000, spent: 5200, bookings: 24 },
    { department: 'Sales', budget: 6000, spent: 3800, bookings: 18 },
    { department: 'Marketing', budget: 5000, spent: 4200, bookings: 22 },
    { department: 'Operations', budget: 4000, spent: 2900, bookings: 16 },
    { department: 'HR', budget: 2000, spent: 1650, bookings: 12 }
  ]);

  const [recentBookings] = useState<BusinessBooking[]>([
    {
      id: 'BB001',
      employeeName: 'Sarah Johnson',
      department: 'Executive',
      service: 'Premium Suit Service',
      amount: 120,
      date: new Date('2024-01-15'),
      status: 'completed',
      approvedBy: 'Auto-approved'
    },
    {
      id: 'BB002',
      employeeName: 'Michael Chen',
      department: 'Sales',
      service: 'Shoe Cleaning',
      amount: 45,
      date: new Date('2024-01-14'),
      status: 'completed'
    },
    {
      id: 'BB003',
      employeeName: 'Emma Williams',
      department: 'Marketing',
      service: 'Dress Cleaning',
      amount: 65,
      date: new Date('2024-01-13'),
      status: 'pending'
    }
  ]);

  // Analytics data
  const monthlySpendData = [
    { month: 'Jul', amount: 15200 },
    { month: 'Aug', amount: 18900 },
    { month: 'Sep', amount: 16800 },
    { month: 'Oct', amount: 21500 },
    { month: 'Nov', amount: 19200 },
    { month: 'Dec', amount: 22100 },
    { month: 'Jan', amount: 18750 }
  ];

  const departmentSpendData = departmentBudgets.map(dept => ({
    department: dept.department,
    spent: dept.spent,
    budget: dept.budget
  }));

  const serviceDistribution = [
    { name: 'Suit Services', value: 35, color: '#FF6B35' },
    { name: 'Shoe Cleaning', value: 28, color: '#F7931E' },
    { name: 'Dress/Formal', value: 22, color: '#FFD700' },
    { name: 'Casual Wear', value: 15, color: '#4CAF50' }
  ];

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12} md={3}>
        <Card sx={{
          height: '260px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ fontSize: '2rem', mr: 1 }} />
              <Typography variant="h6">Monthly Budget</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              R{businessInfo.monthlyBudget.toLocaleString()}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(businessInfo.currentSpend / businessInfo.monthlyBudget) * 100}
              sx={{
                mt: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
              }}
            />
            <Typography sx={{ mt: 1, opacity: 0.9 }}>
              R{businessInfo.currentSpend.toLocaleString()} used (
              {Math.round((businessInfo.currentSpend / businessInfo.monthlyBudget) * 100)}%)
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{
          height: '260px',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Group sx={{ fontSize: '2rem', mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ color: 'white' }}>Active Employees</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {employees.filter(e => e.status === 'active').length}
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              of {businessInfo.employees} total
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{
          height: '260px',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ fontSize: '2rem', mr: 1, color: '#4CAF50' }} />
              <Typography variant="h6" sx={{ color: 'white' }}>This Month</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {recentBookings.length + 89}
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              bookings completed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{
          height: '260px',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assessment sx={{ fontSize: '2rem', mr: 1, color: '#2196F3' }} />
              <Typography variant="h6" sx={{ color: 'white' }}>Avg Per Employee</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              R{Math.round(businessInfo.currentSpend / employees.length)}
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              monthly spend
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Spending Chart */}
      <Grid item xs={12} md={8}>
        <Paper sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            Monthly Spending Trend
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySpendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(26, 16, 64, 0.9)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#FF6B35" 
                strokeWidth={3}
                dot={{ fill: '#FF6B35', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Service Distribution */}
      <Grid item xs={12} md={4}>
        <Paper sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            Service Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{ mt: 2 }}>
            {serviceDistribution.map((entry) => (
              <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: entry.color, 
                  borderRadius: '50%', 
                  mr: 1 
                }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                  {entry.name} ({entry.value}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Department Budgets */}
      <Grid item xs={12}>
        <Paper sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            Department Budget Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentSpendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="department" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(26, 16, 64, 0.9)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="budget" fill="rgba(255, 107, 53, 0.3)" name="Budget" />
              <Bar dataKey="spent" fill="#FF6B35" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderEmployeeManagement = () => (
    <Box>
      {/* Header with Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Employee Management
        </Typography>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => setAddEmployeeOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Employee Table */}
      <TableContainer component={Paper} sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Department</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Monthly Limit</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Current Spend</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Bookings</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ 
                      mr: 2, 
                      background: 'linear-gradient(135deg, #FF6B35, #F7931E)' 
                    }}>
                      {employee.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: 'white', fontWeight: 500 }}>
                        {employee.name}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                        {employee.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{employee.department}</TableCell>
                <TableCell sx={{ color: 'white' }}>R{employee.monthlyLimit}</TableCell>
                <TableCell>
                  <Box>
                    <Typography sx={{ color: 'white' }}>
                      R{employee.currentSpend}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(employee.currentSpend / employee.monthlyLimit) * 100}
                      sx={{
                        mt: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: employee.currentSpend > employee.monthlyLimit * 0.8 
                            ? '#f44336' : theme.palette.primary.main
                        }
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{employee.totalBookings}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.status}
                    size="small"
                    sx={{
                      backgroundColor: employee.status === 'active' ? '#4CAF50' : '#757575',
                      color: 'white',
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: '#f44336' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderBookingHistory = () => (
    <Box>
      {/* Filters */}
      <Paper sx={{
        p: 2,
        mb: 3,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px'
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search bookings..."
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
              }
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              defaultValue="all"
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              <MenuItem value="all">All Departments</MenuItem>
              <MenuItem value="executive">Executive</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
            </Select>
          </FormControl>

          <Button
            startIcon={<Download />}
            variant="outlined"
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main
            }}
          >
            Export
          </Button>
        </Box>
      </Paper>

      {/* Bookings Table */}
      <TableContainer component={Paper} sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Booking ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Department</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Service</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Approved By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                  {booking.id}
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{booking.employeeName}</TableCell>
                <TableCell sx={{ color: 'white' }}>{booking.department}</TableCell>
                <TableCell sx={{ color: 'white' }}>{booking.service}</TableCell>
                <TableCell sx={{ color: 'white' }}>R{booking.amount}</TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {booking.date.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    size="small"
                    sx={{
                      backgroundColor: 
                        booking.status === 'completed' ? '#4CAF50' :
                        booking.status === 'pending' ? '#FF9800' : '#f44336',
                      color: 'white',
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {booking.approvedBy || 'Pending'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative'
    }}>
      <ParticleBackground />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Header - HowItWorks.tsx style */}
        <Box sx={{ textAlign: 'center', mb: 8, pt: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 3,
                letterSpacing: '-0.02em'
              }}
            >
              {businessInfo.name}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 2
              }}
            >
              Business Dashboard
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              {businessInfo.plan} Plan • {businessInfo.employees} Employees • {businessInfo.locations.join(', ')}
            </Typography>
          </motion.div>
        </Box>

        {/* Tabs */}
        <Paper sx={{
          mb: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #FF6B35, #F7931E)',
              },
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600,
                textTransform: 'none',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
            }}
          >
            <Tab icon={<Assessment />} label="Overview" />
            <Tab icon={<Group />} label="Employee Management" />
            <Tab icon={<Business />} label="Booking History" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabPanel value={activeTab} index={0}>
              {renderOverview()}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {renderEmployeeManagement()}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              {renderBookingHistory()}
            </TabPanel>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* Add Employee Dialog */}
      <Dialog
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 16, 64, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Add New Employee</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Full Name"
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                }
              }}
            />
            
            <TextField
              label="Email"
              type="email"
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                }
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Department</InputLabel>
              <Select
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                <MenuItem value="executive">Executive</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="operations">Operations</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Monthly Limit (R)"
              type="number"
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                }
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={() => setAddEmployeeOpen(false)}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                }}
              >
                Add Employee
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
