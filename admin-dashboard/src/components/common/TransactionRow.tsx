import React from 'react';
import { Avatar, Box, Button, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface TransactionRowProps {
  id: number;
  name: string;
  date: string; // ISO string
  amount: number;
  status: string;
  onEdit?: () => void;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  index: number;
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  id,
  name,
  date,
  amount,
  status,
  onEdit,
  getStatusColor,
  formatDate,
  index,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.1 + index * 0.1 }}
    >
      <Box
        sx={{
          display: { xs: 'flex', sm: 'grid' },
          flexDirection: { xs: 'column', sm: 'unset' },
          gridTemplateColumns: { sm: '100px 1fr 120px 120px 120px 100px' },
          gap: { xs: 1, sm: 2 },
          p: 1.5,
          borderRadius: '8px',
          '&:hover': {
            background: 'rgba(255,255,255,0.05)',
          },
          transition: 'all 0.2s ease',
          alignItems: { xs: 'flex-start', sm: 'center' },
          border: { xs: '1px solid rgba(255,255,255,0.1)', sm: 'none' },
          background: { xs: 'rgba(255,255,255,0.02)', sm: 'transparent' },
        }}
      >
        {/* Mobile Layout */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'space-between', width: '100%', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
            #{id}
          </Typography>
          <Chip
            label={status}
            size="small"
            sx={{
              background: getStatusColor(status) + '20',
              color: getStatusColor(status),
              fontSize: '0.625rem',
              height: '20px',
              textTransform: 'capitalize',
            }}
          />
        </Box>

        {/* Desktop Layout */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'white', 
            fontSize: '0.75rem',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          #{id}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: '0.75rem',
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            }}
          >
            {initials}
          </Avatar>
          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem' }}>
            {name}
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.75rem',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          {formatDate(date)}
        </Typography>

        <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem' }}>
          R{amount}
        </Typography>

        {/* Desktop Status Chip */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Chip
            label={status}
            size="small"
            sx={{
              background: getStatusColor(status) + '20',
              color: getStatusColor(status),
              fontSize: '0.625rem',
              height: '20px',
              textTransform: 'capitalize',
            }}
          />
        </Box>

        {/* Mobile Date */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.75rem',
            display: { xs: 'block', sm: 'none' }
          }}
        >
          {formatDate(date)}
        </Typography>

        <Button
          size="small"
          onClick={onEdit}
          sx={{
            color: '#FF6B35',
            fontSize: '0.75rem',
            minWidth: 'auto',
            p: 0.5,
            borderRadius: '8px',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            background: 'rgba(255, 107, 53, 0.1)',
            '&:hover': {
              background: 'rgba(255, 107, 53, 0.2)',
              border: '1px solid rgba(255, 107, 53, 0.5)',
            },
          }}
        >
          Edit
        </Button>
      </Box>
    </motion.div>
  );
};

export default TransactionRow;
