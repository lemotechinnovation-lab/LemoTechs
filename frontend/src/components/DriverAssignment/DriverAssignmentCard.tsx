/**
 * Frontend Integration Example for Driver Assignment System
 * 
 * This file demonstrates how to integrate the new driver assignment
 * system into the React frontend application.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Chip, Box, Alert } from '@mui/material';
import { LocationOn, Person, DirectionsCar, Star, AccessTime } from '@mui/icons-material';

interface DriverInfo {
  driverId: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  distance: number;
  estimatedArrivalTime: number;
  score: number;
}

interface AssignmentResult {
  success: boolean;
  assignedDriver?: DriverInfo;
  alternativeDrivers?: DriverInfo[];
  estimatedWaitTime?: number;
  message: string;
}

// Component for displaying driver assignment status
export const DriverAssignmentCard: React.FC<{
  bookingId: string;
  onDriverAssigned: (driver: DriverInfo) => void;
}> = ({ bookingId, onDriverAssigned }) => {
  const [assignmentStatus, setAssignmentStatus] = useState<'loading' | 'assigned' | 'failed' | 'pending'>('pending');
  const [assignedDriver, setAssignedDriver] = useState<DriverInfo | null>(null);
  const [alternatives, setAlternatives] = useState<DriverInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Auto-assign driver when component mounts
  useEffect(() => {
    assignDriver();
  }, [bookingId]);

  const assignDriver = async () => {
    try {
      setAssignmentStatus('loading');
      setError(null);

      const response = await fetch(`/api/bookings/${bookingId}/assign-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          priority: 'normal',
          customerTier: 'regular'
        })
      });

      const result: AssignmentResult = await response.json();

      if (result.success && result.assignedDriver) {
        setAssignedDriver(result.assignedDriver);
        setAlternatives(result.alternativeDrivers || []);
        setAssignmentStatus('assigned');
        onDriverAssigned(result.assignedDriver);
      } else {
        setAssignmentStatus('failed');
        setError(result.message);
        setAlternatives(result.alternativeDrivers || []);
      }
    } catch (err) {
      setAssignmentStatus('failed');
      setError('Failed to assign driver. Please try again.');
      console.error('Driver assignment error:', err);
    }
  };

  const getStatusColor = () => {
    switch (assignmentStatus) {
      case 'loading': return 'info';
      case 'assigned': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = () => {
    switch (assignmentStatus) {
      case 'loading': return 'Finding best driver...';
      case 'assigned': return 'Driver assigned successfully!';
      case 'failed': return 'Assignment failed';
      default: return 'Waiting for assignment';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="h3">
            Driver Assignment
          </Typography>
          <Chip 
            label={getStatusText()} 
            color={getStatusColor() as any}
            size="small"
          />
        </Box>

        {assignmentStatus === 'loading' && (
          <Box textAlign="center" py={2}>
            <Typography variant="body2" color="text.secondary">
              Searching for available drivers in your area...
            </Typography>
          </Box>
        )}

        {assignmentStatus === 'assigned' && assignedDriver && (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Driver {assignedDriver.name} has been assigned to your booking!
            </Alert>
            
            <DriverInfoCard driver={assignedDriver} isAssigned={true} />
            
            {alternatives.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Alternative Drivers Available:
                </Typography>
                {alternatives.slice(0, 2).map((driver) => (
                  <DriverInfoCard key={driver.driverId} driver={driver} isAssigned={false} />
                ))}
              </Box>
            )}
          </Box>
        )}

        {assignmentStatus === 'failed' && (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            
            {alternatives.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Available Drivers:
                </Typography>
                {alternatives.map((driver) => (
                  <DriverInfoCard key={driver.driverId} driver={driver} isAssigned={false} />
                ))}
              </Box>
            )}
            
            <Button 
              variant="contained" 
              onClick={assignDriver}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        )}

        {assignmentStatus === 'pending' && (
          <Box textAlign="center" py={2}>
            <Button variant="contained" onClick={assignDriver}>
              Assign Driver
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Component for displaying individual driver information
const DriverInfoCard: React.FC<{
  driver: DriverInfo;
  isAssigned: boolean;
}> = ({ driver, isAssigned }) => {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 1, 
        border: isAssigned ? '2px solid #4caf50' : '1px solid #e0e0e0',
        backgroundColor: isAssigned ? '#f1f8e9' : 'transparent'
      }}
    >
      <CardContent sx={{ py: 1.5 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Person color="primary" />
            <Typography variant="subtitle1" fontWeight="medium">
              {driver.name}
            </Typography>
            {isAssigned && (
              <Chip label="Assigned" color="success" size="small" />
            )}
          </Box>
          
          <Box display="flex" alignItems="center" gap={0.5}>
            <Star color="warning" fontSize="small" />
            <Typography variant="body2">
              {driver.rating.toFixed(1)}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <DirectionsCar color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {driver.vehicle}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <LocationOn color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {driver.distance.toFixed(1)} km away
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <AccessTime color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            ETA: {driver.estimatedArrivalTime} minutes
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="caption" color="text.secondary">
            Assignment Score: {(driver.score * 100).toFixed(1)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Hook for managing driver location updates
export const useDriverLocation = (_driverId: string) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = () => {
    setIsTracking(true);
    
    // Simulate location updates (in real app, this would be WebSocket)
    const interval = setInterval(() => {
      // Mock location update
      setLocation({
        lat: -26.2041 + (Math.random() - 0.5) * 0.01,
        lng: 28.0473 + (Math.random() - 0.5) * 0.01
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsTracking(false);
    };
  };

  const updateLocation = async (newLocation: { lat: number; lng: number }) => {
    try {
      await fetch('/api/assignments/driver-location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newLocation)
      });
      
      setLocation(newLocation);
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  return {
    location,
    isTracking,
    startTracking,
    updateLocation
  };
};

// Component for driver dashboard integration
export const DriverAssignmentDashboard: React.FC<{
  driverId: string;
}> = ({ driverId: _driverId }) => {
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          fetchAvailableJobs(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  const fetchAvailableJobs = async (location: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `/api/assignments/available-drivers?lat=${location.lat}&lng=${location.lng}&radius=10`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const result = await response.json();
      if (result.success) {
        setAvailableJobs(result.data.drivers);
      }
    } catch (error) {
      console.error('Failed to fetch available jobs:', error);
    }
  };

  const acceptJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/assignments/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingId: jobId })
      });

      const result = await response.json();
      if (result.success) {
        // Refresh available jobs
        if (currentLocation) {
          fetchAvailableJobs(currentLocation);
        }
      }
    } catch (error) {
      console.error('Failed to accept job:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Available Jobs
      </Typography>
      
      {availableJobs.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No jobs available in your area
        </Typography>
      ) : (
        availableJobs.map((job) => (
          <Card key={job.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{job.customerName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {job.customerAddress}
              </Typography>
              <Typography variant="body2">
                Distance: {job.distance?.toFixed(1)} km
              </Typography>
              <Typography variant="body2">
                Amount: R{job.amount}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => acceptJob(job.id)}
                sx={{ mt: 1 }}
              >
                Accept Job
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default DriverAssignmentCard;
