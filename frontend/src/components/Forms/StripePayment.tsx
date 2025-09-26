import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { paymentService } from '../../services';

interface StripePaymentProps {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  bookingId: string;
  onPaymentSuccess: (response: any) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

export const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  currency,
  description,
  customerEmail,
  customerName,
  bookingId,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}) => {
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [paymentElement, setPaymentElement] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [paymentReady, setPaymentReady] = useState(false);

  // Initialize Stripe and create PaymentIntent
  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Create PaymentIntent
        const response = await paymentService.createPaymentIntent(
          amount,
          currency,
          {
            description,
            customerEmail,
            customerName,
            bookingId
          }
        );

        if (!response.clientSecret) {
          throw new Error('Failed to initialize payment');
        }

        setClientSecret(response.clientSecret);

        // For demo purposes, set mock stripe and elements
        const stripeInstance = null;
        const elementsInstance = null;

        setStripe(stripeInstance);
        setElements(elementsInstance);
        setPaymentElement(null);

        // In a real implementation, payment elements would be mounted here
        // paymentElement.mount('#payment-element');

        // Listen for changes would be implemented here
        // For demo purposes, set as ready
        setPaymentReady(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
        setIsLoading(false);
      }
    };

    initializePayment();

    // Cleanup
    return () => {
      if (paymentElement) {
        paymentElement.unmount();
      }
    };
  }, [amount, currency, description, customerEmail, customerName, bookingId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentElement || !clientSecret) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Mock payment confirmation for demo
      const response = { success: true, paymentIntent: { id: 'pi_mock' } };

      if (response.success) {
        onPaymentSuccess(response);
      } else {
        setError('Payment failed');
        onPaymentError('Payment failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2
      }}>
        <CircularProgress size={40} sx={{ color: 'primary.main' }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Initializing secure payment...
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{
        background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,107,53,0.2)',
        borderRadius: 3,
        p: 4,
        maxWidth: '500px',
        mx: 'auto'
      }}>
        {/* Payment Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{
            color: 'white',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 600,
            mb: 1
          }}>
            Complete Your Payment
          </Typography>
          <Typography sx={{
            color: 'rgba(255,255,255,0.8)',
            fontFamily: '"Inter", sans-serif'
          }}>
            {description}
          </Typography>
          <Typography variant="h4" sx={{
            color: 'primary.main',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 700,
            mt: 2
          }}>
            {formatAmount(amount)}
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              bgcolor: 'rgba(211, 47, 47, 0.1)',
              border: '1px solid rgba(211, 47, 47, 0.3)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: '#f44336'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          {/* Stripe Payment Element */}
          <Box sx={{ mb: 4 }}>
            <div id="payment-element" style={{ minHeight: '200px' }} />
          </Box>

          {/* Payment Summary */}
          <Box sx={{
            p: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            mb: 3
          }}>
            <Typography sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Payment Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Service Total
              </Typography>
              <Typography sx={{ color: 'white' }}>
                {formatAmount(amount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Processing Fee
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Included
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              pt: 2,
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Typography sx={{ color: 'white', fontWeight: 600 }}>
                Total
              </Typography>
              <Typography sx={{ color: 'primary.main', fontWeight: 700 }}>
                {formatAmount(amount)}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isProcessing}
              sx={{
                flex: 1,
                color: 'rgba(255,255,255,0.8)',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!paymentReady || isProcessing}
              sx={{
                flex: 2,
                bgcolor: 'primary.main',
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&:disabled': {
                  bgcolor: 'rgba(255,107,53,0.3)',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              {isProcessing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  Processing...
                </Box>
              ) : (
                `Pay ${formatAmount(amount)}`
              )}
            </Button>
          </Box>
        </form>

        {/* Security Notice */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.85rem',
            fontFamily: '"Inter", sans-serif'
          }}>
            🔒 Your payment information is secure and encrypted by Stripe
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};
