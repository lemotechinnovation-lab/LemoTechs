import React, { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1A1040 0%, #251454 50%, #1A1040 100%)',
          position: 'relative',
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          '@keyframes pulse': {
            '0%': {
              opacity: 1,
              transform: 'scale(1)',
            },
            '50%': {
              opacity: 0.5,
              transform: 'scale(1.1)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {children}
        </motion.div>
      </Box>
    </>
  );
};

export default DashboardLayout;
