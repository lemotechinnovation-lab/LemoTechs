import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  Chip,
  Divider,
  Card,
  CardContent,
  Switch,
  useTheme,
  Alert
} from '@mui/material';
import { 
  CameraAlt,
  Discount
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AdvancedBookingFormProps {
  onSubmit: (bookingData: any) => void;
  onBack: () => void;
}

export const AdvancedBookingForm = ({ onSubmit, onBack }: AdvancedBookingFormProps) => {
  const theme = useTheme();
  
  // Form state
  const [bookingType, setBookingType] = useState<'immediate' | 'scheduled' | 'recurring'>('immediate');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [recurringEndDate, setRecurringEndDate] = useState<Date | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [bulkDiscount, setBulkDiscount] = useState(false);
  const [priorityService, setPriorityService] = useState(false);

  // Available services with bulk pricing
  const serviceItems = [
    { id: 'shoes-basic', name: 'Basic Shoe Clean', price: 25, bulkPrice: 20, category: 'shoes' },
    { id: 'shoes-premium', name: 'Premium Shoe Restore', price: 45, bulkPrice: 35, category: 'shoes' },
    { id: 'shirt', name: 'Shirt/Blouse', price: 15, bulkPrice: 12, category: 'clothing' },
    { id: 'pants', name: 'Pants/Trousers', price: 20, bulkPrice: 16, category: 'clothing' },
    { id: 'suit', name: 'Full Suit', price: 65, bulkPrice: 55, category: 'clothing' },
    { id: 'dress', name: 'Dress/Gown', price: 35, bulkPrice: 28, category: 'clothing' },
    { id: 'jacket', name: 'Jacket/Blazer', price: 40, bulkPrice: 32, category: 'clothing' },
    { id: 'handbag', name: 'Handbag/Purse', price: 30, bulkPrice: 25, category: 'accessories' }
  ];

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => {
      const newItems = prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      // Auto-enable bulk discount for 5+ items
      setBulkDiscount(newItems.length >= 5);
      return newItems;
    });
  };

  const calculateTotal = () => {
    const itemsTotal = selectedItems.reduce((sum, itemId) => {
      const item = serviceItems.find(s => s.id === itemId);
      if (!item) return sum;
      
      const price = bulkDiscount ? item.bulkPrice : item.price;
      return sum + price;
    }, 0);

    const priorityFee = priorityService ? itemsTotal * 0.3 : 0; // 30% priority fee
    const recurringDiscount = bookingType === 'recurring' ? itemsTotal * 0.15 : 0; // 15% recurring discount
    
    return Math.max(0, itemsTotal + priorityFee - recurringDiscount);
  };

  const getSavings = () => {
    const regularTotal = selectedItems.reduce((sum, itemId) => {
      const item = serviceItems.find(s => s.id === itemId);
      return sum + (item?.price || 0);
    }, 0);
    
    const discountedTotal = calculateTotal() - (priorityService ? calculateTotal() * 0.23 : 0);
    return Math.max(0, regularTotal - discountedTotal);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(prev => [...prev, ...files].slice(0, 5)); // Max 5 photos
  };

  const handleSubmit = () => {
    const bookingData = {
      type: bookingType,
      items: selectedItems,
      scheduledDate,
      scheduledTime,
      recurringFrequency: bookingType === 'recurring' ? recurringFrequency : null,
      recurringEndDate: bookingType === 'recurring' ? recurringEndDate : null,
      specialInstructions,
      photos,
      bulkDiscount,
      priorityService,
      total: calculateTotal(),
      savings: getSavings()
    };
    
    onSubmit(bookingData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            color: 'white', 
            fontWeight: 700,
            mb: 1
          }}>
            Advanced Booking
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Schedule, batch, and customize your cleaning service
          </Typography>
        </Box>

        {/* Booking Type Selection */}
        <Paper sx={{
          p: 3,
          mb: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Booking Type
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value as any)}
              sx={{ gap: 1 }}
            >
              <FormControlLabel
                value="immediate"
                control={<Radio sx={{ color: theme.palette.primary.main }} />}
                label={
                  <Box>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>
                      Immediate Pickup
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                      Schedule pickup within the next 2 hours
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                value="scheduled"
                control={<Radio sx={{ color: theme.palette.primary.main }} />}
                label={
                  <Box>
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>
                      Scheduled Pickup
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                      Choose a specific date and time
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                value="recurring"
                control={<Radio sx={{ color: theme.palette.primary.main }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box>
                      <Typography sx={{ color: 'white', fontWeight: 500 }}>
                        Recurring Service
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                        Regular pickups with 15% discount
                      </Typography>
                    </Box>
                    <Chip 
                      label="15% OFF" 
                      size="small"
                      sx={{ 
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>

          {/* Scheduling Options */}
          <AnimatePresence>
            {(bookingType === 'scheduled' || bookingType === 'recurring') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <DatePicker
                      label="Pickup Date"
                      value={scheduledDate}
                      onChange={setScheduledDate}
                      minDate={new Date()}
                      sx={{
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: theme.palette.primary.main },
                        }
                      }}
                    />
                    
                    <TimePicker
                      label="Pickup Time"
                      value={scheduledTime}
                      onChange={setScheduledTime}
                      sx={{
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: theme.palette.primary.main },
                        }
                      }}
                    />
                  </Box>

                  {bookingType === 'recurring' && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <FormControl sx={{ minWidth: 150 }}>
                        <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                          Frequency
                        </FormLabel>
                        <Select
                          value={recurringFrequency}
                          onChange={(e) => setRecurringFrequency(e.target.value as any)}
                          sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255, 255, 255, 0.3)'
                            }
                          }}
                        >
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="biweekly">Bi-weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <DatePicker
                        label="End Date (Optional)"
                        value={recurringEndDate}
                        onChange={setRecurringEndDate}
                        minDate={scheduledDate || new Date()}
                        sx={{
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiInputBase-input': { color: 'white' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>

        {/* Item Selection */}
        <Paper sx={{
          p: 3,
          mb: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Select Items
            </Typography>
            {selectedItems.length >= 5 && (
              <Chip 
                label="Bulk Discount Applied!" 
                icon={<Discount />}
                sx={{ 
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
            {serviceItems.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const price = bulkDiscount ? item.bulkPrice : item.price;
              const savings = item.price - item.bulkPrice;

              return (
                <Card
                  key={item.id}
                  onClick={() => handleItemToggle(item.id)}
                  sx={{
                    cursor: 'pointer',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(247, 147, 30, 0.2) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${isSelected ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '12px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography sx={{ color: 'white', fontWeight: 500 }}>
                        {item.name}
                      </Typography>
                      <Checkbox
                        checked={isSelected}
                        sx={{ p: 0, color: theme.palette.primary.main }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                        R{price}
                      </Typography>
                      
                      {bulkDiscount && savings > 0 && (
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ 
                            color: 'rgba(255, 255, 255, 0.5)', 
                            fontSize: '0.8rem',
                            textDecoration: 'line-through'
                          }}>
                            R{item.price}
                          </Typography>
                          <Typography sx={{ 
                            color: '#4CAF50', 
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}>
                            Save R{savings}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Paper>

        {/* Service Options */}
        <Paper sx={{
          p: 3,
          mb: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Service Options
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 500 }}>
                  Priority Service
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                  Get your items back 50% faster (+30% fee)
                </Typography>
              </Box>
              <Switch
                checked={priorityService}
                onChange={(e) => setPriorityService(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box>
              <Typography sx={{ color: 'white', fontWeight: 500, mb: 1 }}>
                Special Instructions
              </Typography>
              <TextField
                multiline
                rows={3}
                fullWidth
                placeholder="Any special care instructions, stain details, or preferences..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                  }
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ color: 'white', fontWeight: 500, mb: 1 }}>
                Upload Photos (Optional)
              </Typography>
              <Button
                component="label"
                startIcon={<CameraAlt />}
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  border: '1px dashed',
                  borderRadius: '8px',
                  p: 2,
                  width: '100%',
                  textTransform: 'none'
                }}
              >
                Upload photos of stains or damage ({photos.length}/5)
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </Button>
              
              {photos.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {photos.map((photo, index) => (
                    <Chip
                      key={index}
                      label={photo.name}
                      onDelete={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                      sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Pricing Summary */}
        <Paper sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.1) 100%)',
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: '16px'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Pricing Summary
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Items ({selectedItems.length})
            </Typography>
            <Typography sx={{ color: 'white' }}>
              R{selectedItems.reduce((sum, id) => {
                const item = serviceItems.find(s => s.id === id);
                return sum + (item?.price || 0);
              }, 0)}
            </Typography>
          </Box>

          {bulkDiscount && getSavings() > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#4CAF50' }}>
                Bulk Discount
              </Typography>
              <Typography sx={{ color: '#4CAF50' }}>
                -R{getSavings()}
              </Typography>
            </Box>
          )}

          {bookingType === 'recurring' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#4CAF50' }}>
                Recurring Discount (15%)
              </Typography>
              <Typography sx={{ color: '#4CAF50' }}>
                -R{Math.round(calculateTotal() * 0.15)}
              </Typography>
            </Box>
          )}

          {priorityService && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Priority Service (30%)
              </Typography>
              <Typography sx={{ color: 'white' }}>
                +R{Math.round(calculateTotal() * 0.23)}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Total
            </Typography>
            <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              R{calculateTotal()}
            </Typography>
          </Box>

          {getSavings() > 0 && (
            <Typography sx={{ 
              color: '#4CAF50', 
              fontSize: '0.9rem',
              textAlign: 'right',
              mt: 1
            }}>
              You save R{getSavings()}!
            </Typography>
          )}
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={onBack}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: 'white' }
            }}
          >
            ← Back
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={selectedItems.length === 0}
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {bookingType === 'immediate' ? 'Book Now' : 
             bookingType === 'scheduled' ? 'Schedule Booking' : 
             'Set Up Recurring Service'} - R{calculateTotal()}
          </Button>
        </Box>

        {selectedItems.length === 0 && (
          <Alert severity="info" sx={{ mt: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
            Please select at least one item to continue
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};
