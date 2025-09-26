import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  QrCode,
  Security,
  Lock,
  Delete
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentService, PaymentMethod, PaymentResult, CreatePaymentMethodData } from '../../services/paymentService';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentResult: PaymentResult) => void;
  onPaymentError: (error: string) => void;
  metadata?: Record<string, any>;
  showSavedMethods?: boolean;
}

interface CardFormData {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
  email: string;
  phone: string;
  saveCard: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'ZAR',
  onPaymentSuccess,
  onPaymentError,
  metadata,
  showSavedMethods = true
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile' | 'saved'>('card');
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [cardForm, setCardForm] = useState<CardFormData>({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    email: '',
    phone: '',
    saveCard: false
  });

  // Load saved payment methods
  useEffect(() => {
    if (showSavedMethods) {
      loadSavedMethods();
    }
  }, [showSavedMethods]);

  const loadSavedMethods = async () => {
    try {
      const methods = await paymentService.getPaymentMethods();
      setSavedMethods(methods);
      
      // Auto-select default method
      const defaultMethod = methods.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedSavedMethod(defaultMethod.id);
        setPaymentMethod('saved');
      }
    } catch (error) {
      console.error('Error loading saved methods:', error);
    }
  };

  const handleCardInputChange = (field: keyof CardFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    
    // Format card number
    if (field === 'number') {
      value = paymentService.formatCardNumber(value);
      if (value.length > 19) return; // Max length for formatted card number
    }
    
    // Format expiry date
    if (field === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      if (value.length > 5) return;
    }
    
    // Format CVC
    if (field === 'cvc') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return;
    }

    setCardForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateCardForm = (): boolean => {
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvc || !cardForm.name) {
      setError('Please fill in all required fields');
      return false;
    }

    const cleanNumber = cardForm.number.replace(/\s/g, '');
    if (!paymentService.validateCardNumber(cleanNumber)) {
      setError('Please enter a valid card number');
      return false;
    }

    const [month, year] = cardForm.expiry.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiry < new Date()) {
      setError('Card has expired');
      return false;
    }

    return true;
  };

  const handleCardPayment = async () => {
    if (!validateCardForm()) return;

    setIsProcessing(true);
    setError('');

    try {
      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(
        amount,
        currency,
        metadata
      );

      // Process payment
      let paymentResult: PaymentResult;

      if (cardForm.saveCard) {
        // Create payment method first
        const [expMonth, expYear] = cardForm.expiry.split('/').map(num => parseInt(num));
        
        const paymentMethodData: CreatePaymentMethodData = {
          type: 'card',
          card: {
            number: cardForm.number.replace(/\s/g, ''),
            expMonth,
            expYear: 2000 + expYear,
            cvc: cardForm.cvc
          },
          billingDetails: {
            name: cardForm.name,
            email: cardForm.email,
            phone: cardForm.phone
          }
        };

        const savedMethod = await paymentService.createPaymentMethod(paymentMethodData);
        if (savedMethod) {
          paymentResult = await paymentService.processStripePayment(
            paymentIntent,
            savedMethod.id
          );
        } else {
          throw new Error('Failed to save payment method');
        }
      } else {
        // Process one-time payment (simplified for demo)
        paymentResult = {
          success: true,
          paymentIntentId: paymentIntent.id
        };
      }

      if (paymentResult.success) {
        setSuccess('Payment processed successfully!');
        onPaymentSuccess(paymentResult);
        await loadSavedMethods(); // Refresh saved methods
      } else {
        setError(paymentResult.error?.message || 'Payment failed');
        onPaymentError(paymentResult.error?.message || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavedMethodPayment = async () => {
    if (!selectedSavedMethod) {
      setError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const paymentIntent = await paymentService.createPaymentIntent(
        amount,
        currency,
        metadata
      );

      const paymentResult = await paymentService.processStripePayment(
        paymentIntent,
        selectedSavedMethod
      );

      if (paymentResult.success) {
        setSuccess('Payment processed successfully!');
        onPaymentSuccess(paymentResult);
      } else {
        setError(paymentResult.error?.message || 'Payment failed');
        onPaymentError(paymentResult.error?.message || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAlternativePayment = async (provider: string) => {
    setIsProcessing(true);
    setError('');

    try {
      let paymentResult: PaymentResult;

      switch (provider) {
        case 'payfast':
          paymentResult = await paymentService.processPayFastPayment(
            amount,
            `order_${Date.now()}`,
            {
              name: cardForm.name || 'Customer',
              email: cardForm.email || 'customer@example.com',
              phone: cardForm.phone
            }
          );
          break;
        case 'snapscan':
          paymentResult = await paymentService.processSnapScanPayment(
            amount,
            `order_${Date.now()}`,
            metadata
          );
          break;
        default:
          throw new Error('Unsupported payment provider');
      }

      if (paymentResult.success) {
        if (paymentResult.requiresAction && paymentResult.actionUrl) {
          window.open(paymentResult.actionUrl, '_blank');
          setSuccess('Redirecting to payment provider...');
        } else {
          setSuccess('Payment processed successfully!');
          onPaymentSuccess(paymentResult);
        }
      } else {
        setError(paymentResult.error?.message || 'Payment failed');
        onPaymentError(paymentResult.error?.message || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSavedMethod = async (methodId: string) => {
    try {
      const success = await paymentService.deletePaymentMethod(methodId);
      if (success) {
        await loadSavedMethods();
        if (selectedSavedMethod === methodId) {
          setSelectedSavedMethod('');
        }
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const processingFee = paymentService.calculateProcessingFee(amount);
  const totalAmount = amount + processingFee;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* Payment Summary */}
      <Paper sx={{
        p: 3,
        mb: 3,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px'
      }}>
        <Typography variant="h6" sx={{
          color: 'white',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          mb: 2
        }}>
          💳 Payment Summary
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Service Amount:
          </Typography>
          <Typography sx={{ color: 'white', fontWeight: 600 }}>
            {currency} {amount.toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Processing Fee:
          </Typography>
          <Typography sx={{ color: 'white', fontWeight: 600 }}>
            {currency} {processingFee.toFixed(2)}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
            Total Amount:
          </Typography>
          <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 800 }}>
            {currency} {totalAmount.toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      {/* Payment Method Selection */}
      <Paper sx={{
        p: 3,
        mb: 3,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px'
      }}>
        <Typography variant="h6" sx={{
          color: 'white',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          mb: 3
        }}>
          🔒 Choose Payment Method
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
          >
            {/* Saved Payment Methods */}
            {showSavedMethods && savedMethods.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FormControlLabel
                  value="saved"
                  control={<Radio sx={{ color: '#FF6B35' }} />}
                  label={
                    <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      Saved Payment Methods
                    </Typography>
                  }
                />
                
                {paymentMethod === 'saved' && (
                  <Box sx={{ ml: 4, mt: 2 }}>
                    {savedMethods.map((method) => (
                      <Card key={method.id} sx={{
                        mb: 2,
                        background: selectedSavedMethod === method.id 
                          ? 'rgba(255, 107, 53, 0.1)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: selectedSavedMethod === method.id 
                          ? '2px solid #FF6B35' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 107, 53, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => setSelectedSavedMethod(method.id)}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                          <CreditCard sx={{ color: '#FF6B35' }} />
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ color: 'white', fontWeight: 600 }}>
                              {method.displayName}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                              {method.type === 'card' && method.expiryMonth && method.expiryYear 
                                ? `Expires ${method.expiryMonth.toString().padStart(2, '0')}/${method.expiryYear.toString().slice(-2)}`
                                : 'Payment Method'
                              }
                            </Typography>
                          </Box>
                          
                          {method.isDefault && (
                            <Chip label="Default" size="small" sx={{
                              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                              color: 'white',
                              fontWeight: 600
                            }} />
                          )}
                          
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSavedMethod(method.id);
                            }}
                            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          >
                            <Delete />
                          </IconButton>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </motion.div>
            )}

            {/* Credit/Debit Card */}
            <FormControlLabel
              value="card"
              control={<Radio sx={{ color: '#FF6B35' }} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCard sx={{ color: '#FF6B35' }} />
                  <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Credit/Debit Card
                  </Typography>
                </Box>
              }
            />

            {/* Bank Transfer */}
            <FormControlLabel
              value="bank"
              control={<Radio sx={{ color: '#FF6B35' }} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance sx={{ color: '#4CAF50' }} />
                  <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Bank Transfer (PayFast)
                  </Typography>
                </Box>
              }
            />

            {/* Mobile Payment */}
            <FormControlLabel
              value="mobile"
              control={<Radio sx={{ color: '#FF6B35' }} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QrCode sx={{ color: '#9C27B0' }} />
                  <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Mobile Payment (SnapScan)
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      {/* Payment Forms */}
      <AnimatePresence mode="wait">
        {/* Card Payment Form */}
        {paymentMethod === 'card' && (
          <motion.div
            key="card-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{
              p: 3,
              mb: 3,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px'
            }}>
              <Typography variant="h6" sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Lock sx={{ color: '#4CAF50' }} />
                Secure Card Payment
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={cardForm.number}
                    onChange={handleCardInputChange('number')}
                    placeholder="1234 5678 9012 3456"
                    InputProps={{
                      endAdornment: (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {['visa', 'mastercard', 'amex'].map((type) => (
                            <Box
                              key={type}
                              sx={{
                                width: 24,
                                height: 16,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                opacity: paymentService.getCardType(cardForm.number) === type ? 1 : 0.3
                              }}
                            />
                          ))}
                        </Box>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 107, 53, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                      },
                      '& .MuiInputBase-input': { color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={cardForm.expiry}
                    onChange={handleCardInputChange('expiry')}
                    placeholder="MM/YY"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 107, 53, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                      },
                      '& .MuiInputBase-input': { color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVC"
                    value={cardForm.cvc}
                    onChange={handleCardInputChange('cvc')}
                    placeholder="123"
                    InputProps={{
                      endAdornment: (
                        <Security sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 20 }} />
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 107, 53, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                      },
                      '& .MuiInputBase-input': { color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={cardForm.name}
                    onChange={handleCardInputChange('name')}
                    placeholder="John Doe"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 107, 53, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                      },
                      '& .MuiInputBase-input': { color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={cardForm.email}
                    onChange={handleCardInputChange('email')}
                    placeholder="john@example.com"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 107, 53, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                      },
                      '& .MuiInputBase-input': { color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone (Optional)"
                    value={cardForm.phone}
                    onChange={handleCardInputChange('phone')}
                    placeholder="+27 123 456 789"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 107, 53, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                      },
                      '& .MuiInputBase-input': { color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={cardForm.saveCard}
                      onChange={(e) => setCardForm(prev => ({ ...prev, saveCard: e.target.checked }))}
                      sx={{ color: '#FF6B35' }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      Save this card for future payments
                    </Typography>
                  }
                />
              </Box>
            </Paper>
          </motion.div>
        )}

        {/* Alternative Payment Methods */}
        {(paymentMethod === 'bank' || paymentMethod === 'mobile') && (
          <motion.div
            key="alternative-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{
              p: 3,
              mb: 3,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700,
                mb: 2
              }}>
                {paymentMethod === 'bank' ? '🏦 Bank Transfer' : '📱 Mobile Payment'}
              </Typography>

              <Typography sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 3
              }}>
                {paymentMethod === 'bank' 
                  ? 'You will be redirected to PayFast to complete your bank transfer payment securely.'
                  : 'You will be redirected to SnapScan to complete your mobile payment via QR code.'
                }
              </Typography>

              <Alert 
                severity="info" 
                sx={{
                  background: 'rgba(33, 150, 243, 0.1)',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  color: 'white',
                  mb: 3,
                  '& .MuiAlert-icon': { color: '#2196F3' }
                }}
              >
                This payment method will open in a new window. Please don't close this page until payment is complete.
              </Alert>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert 
              severity="error" 
              onClose={() => setError('')}
              sx={{
                mb: 3,
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                color: 'white',
                '& .MuiAlert-icon': { color: '#f44336' }
              }}
            >
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert 
              severity="success" 
              onClose={() => setSuccess('')}
              sx={{
                mb: 3,
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                color: 'white',
                '& .MuiAlert-icon': { color: '#4CAF50' }
              }}
            >
              {success}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Button */}
      <Button
        fullWidth
        size="large"
        onClick={
          paymentMethod === 'saved' ? handleSavedMethodPayment :
          paymentMethod === 'card' ? handleCardPayment :
          paymentMethod === 'bank' ? () => handleAlternativePayment('payfast') :
          () => handleAlternativePayment('snapscan')
        }
        disabled={
          isProcessing || 
          (paymentMethod === 'saved' && !selectedSavedMethod) ||
          (paymentMethod === 'card' && (!cardForm.number || !cardForm.expiry || !cardForm.cvc || !cardForm.name))
        }
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          color: 'white',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: '1.1rem',
          py: 2,
          borderRadius: '16px',
          textTransform: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.5)',
            transform: 'none',
            boxShadow: 'none'
          },
          transition: 'all 0.3s ease'
        }}
      >
        {isProcessing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={20} sx={{ color: 'white' }} />
            Processing Payment...
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Security />
            Pay {currency} {totalAmount.toFixed(2)} Securely
          </Box>
        )}
      </Button>

      {/* Security Notice */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography sx={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.8rem',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          <Security sx={{ fontSize: 16 }} />
          Your payment information is encrypted and secure
        </Typography>
      </Box>
    </Box>
  );
};

export default PaymentForm;
