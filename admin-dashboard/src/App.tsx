import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { Header, Sidebar } from './components/layout';
import { Dashboard } from './containers';
import { Login } from './pages';
import theme from './theme';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // For demo purposes, set to true to show dashboard

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1A1040 0%, #251454 50%, #1A1040 100%)',
        position: 'relative'
      }}>
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ 
                position: 'sticky', 
                top: 0, 
                height: '100vh',
                zIndex: 2
              }}
            >
              <Sidebar 
                currentPage={currentPage} 
                onPageChange={setCurrentPage}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 3,
            background: 'linear-gradient(135deg, #1A1040 0%, #251454 50%, #1A1040 100%)',
            backdropFilter: 'blur(20px)'
          }}>
          <Header 
            onToggleSidebar={toggleSidebar}
            currentPage={currentPage}
          />
          </Box>
          
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard currentPage={currentPage} />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;