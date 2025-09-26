import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import GoogleMap from './GoogleMap';
import { MapViewProps } from '../../types/booking';

export const MapView = ({
  pickupLocation,
  pickupCoords,
  drivers,
  selectedDriver,
  onDriverSelect,
  showDriversList
}: MapViewProps) => {
  return (
    <Box sx={{
      flex: 1,
      minWidth: '300px', // Ensure minimum width for map visibility
      background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.8) 0%, rgba(37, 20, 84, 0.9) 100%)',
      position: 'relative',
      display: { xs: 'none', md: 'block' },
      overflow: 'hidden',
      height: '100vh', // Full viewport height since header is hidden
      maxHeight: '100vh',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(247, 147, 30, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 1
      }
    }}>
      {/* Enhanced Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.25) 0%, rgba(247, 147, 30, 0.15) 50%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 2
        }} />
      </motion.div>
      
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.7, 0.4],
          x: [0, 10, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Box sx={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247, 147, 30, 0.2) 0%, rgba(255, 215, 0, 0.1) 50%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 2
        }} />
      </motion.div>
      
      {/* Additional floating elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.2) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 2
        }} />
      </motion.div>

      {/* Premium Route Visualization */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        right: '5%',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {/* Route Info Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(10, 10, 25, 0.9) 0%, rgba(37, 20, 84, 0.85) 100%)',
            backdropFilter: 'blur(25px)',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderRadius: { xs: 2.5, md: 3 },
            p: { xs: 2.5, md: 3 },
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(255, 107, 53, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 70%, rgba(255, 107, 53, 0.08) 0%, transparent 50%)',
              pointerEvents: 'none',
              zIndex: 0
            },
            '&:hover': {
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 16px 50px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(255, 107, 53, 0.15)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}>
            <Typography sx={{ 
              color: '#FFD700', 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <span style={{ fontSize: '1.3rem' }}>🗺️</span>
              Your Route
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '1.5rem' }}>🟢</Typography>
                <Box>
                  <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                    Pickup Location
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                    {pickupLocation || 'Enter pickup location'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ ml: 3, borderLeft: '2px dashed rgba(255, 255, 255, 0.3)', height: '30px' }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '1.5rem' }}>🔴</Typography>
                <Box>
                  <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                    Delivery Location
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                    {'Same as pickup'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Live Driver Tracking */}
        {showDriversList && drivers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box sx={{
              background: 'linear-gradient(135deg, rgba(10, 10, 25, 0.9) 0%, rgba(37, 20, 84, 0.85) 50%, rgba(103, 58, 183, 0.8) 100%)',
              backdropFilter: 'blur(25px)',
              border: '2px solid rgba(33, 150, 243, 0.2)',
              borderRadius: { xs: 2.5, md: 3 },
              p: { xs: 2.5, md: 3 },
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(33, 150, 243, 0.1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.1) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 0
              },
              '&:hover': {
                border: '2px solid rgba(33, 150, 243, 0.3)',
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(33, 150, 243, 0.2)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}>
              <Typography sx={{ 
                color: '#FFD700', 
                fontSize: '1rem', 
                fontWeight: 600, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <span style={{ fontSize: '1.2rem' }}>🚗</span>
                Live Driver Locations
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {drivers.map((driver) => (
                  <motion.div
                    key={driver.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDriverSelect(driver.id)}
                  >
                    <Box sx={{
                      p: { xs: 1.5, md: 2 },
                      borderRadius: { xs: 1.5, md: 2 },
                      border: selectedDriver === driver.id 
                        ? '2px solid #FFD700' 
                        : '1px solid rgba(255, 255, 255, 0.15)',
                      background: selectedDriver === driver.id
                        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 107, 53, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      backdropFilter: 'blur(10px)',
                      boxShadow: selectedDriver === driver.id
                        ? '0 6px 20px rgba(255, 215, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                        : '0 3px 12px rgba(0, 0, 0, 0.08)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                        transition: 'left 0.5s ease'
                      },
                      '&:hover': {
                        background: selectedDriver === driver.id
                          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 107, 53, 0.15) 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                        transform: 'translateX(6px) scale(1.01)',
                        boxShadow: selectedDriver === driver.id
                          ? '0 10px 30px rgba(255, 215, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)'
                          : '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(255, 255, 255, 0.1)',
                        border: selectedDriver === driver.id
                          ? '2px solid #FFD700'
                          : '1px solid rgba(255, 255, 255, 0.25)',
                        '&::before': {
                          left: '100%'
                        }
                      }
                    }}>
                      <Typography sx={{ fontSize: '2rem' }}>
                        {driver.avatar}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ 
                          color: 'white', 
                          fontSize: '0.9rem', 
                          fontWeight: 600 
                        }}>
                          {driver.name}
                        </Typography>
                        <Typography sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          fontSize: '0.75rem' 
                        }}>
                          {driver.estimatedTime} away • {driver.distance}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        animation: selectedDriver === driver.id ? 'pulse 2s infinite' : 'none'
                      }}>
                        <Typography sx={{ 
                          color: '#4CAF50', 
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          ⭐ {driver.rating}
                        </Typography>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: driver.available ? '#4CAF50' : '#f44336',
                          animation: driver.available ? 'fadeInOut 2s infinite' : 'none'
                        }} />
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Uber-Style Map with Route and Available Drivers */}
      {showDriversList && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 10
        }}>
          {/* Google Maps Integration */}
          <GoogleMap
            center={pickupCoords || { lat: -26.2041, lng: 28.0473 }}
            zoom={pickupCoords ? 15 : 13}
            pickupLocation={pickupLocation}
            destinationLocation={pickupLocation}
            drivers={drivers.map(driver => ({
              id: driver.id,
              name: driver.name,
              position: { lat: -26.2041 + Math.random() * 0.01, lng: 28.0473 + Math.random() * 0.01 },
              estimatedArrival: driver.estimatedTime
            }))}
            onDriverSelect={onDriverSelect}
          />
        </Box>
      )}

      {/* Map Loading State */}
      {!showDriversList && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 10
        }}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Typography sx={{ fontSize: '4rem', mb: 2 }}>🗺️</Typography>
          </motion.div>
          <Typography sx={{ 
            color: 'white', 
            fontSize: '1.2rem', 
            fontWeight: 600,
            mb: 1
          }}>
            Preparing Your Route
          </Typography>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '0.9rem'
          }}>
            Set your pickup location to see available drivers
          </Typography>
        </Box>
      )}

      {/* Premium Visual Effects */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(to top, rgba(26, 16, 64, 0.9), transparent)',
        pointerEvents: 'none',
        zIndex: 8
      }} />
    </Box>
  );
};
