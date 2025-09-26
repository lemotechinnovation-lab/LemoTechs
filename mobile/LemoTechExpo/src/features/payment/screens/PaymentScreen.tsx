import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  PrimaryButton, 
  SecondaryButton,
  CardIcon,
  CashIcon,
  MobileIcon,
  CheckIcon,
  PlusIcon
} from '../../../design-system';
import { COLORS } from '../../../constants/app';

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'mobile';
  name: string;
  icon: React.ReactNode;
  details?: string;
  isDefault?: boolean;
}

interface PaymentScreenProps {
  navigation?: any;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit or Debit Card',
      icon: <CardIcon size="lg" variant="default" />,
      details: '**** **** **** 1234',
      isDefault: true
    },
    {
      id: 'mobile',
      type: 'mobile',
      name: 'Mobile Payment',
      icon: <MobileIcon size="lg" variant="default" />,
      details: 'PayPal, Apple Pay, Google Pay'
    },
    {
      id: 'cash',
      type: 'cash',
      name: 'Cash',
      icon: <CashIcon size="lg" variant="default" />,
      details: 'Pay with cash on delivery'
    }
  ];

  const handleAddPaymentMethod = () => {
    Alert.alert(
      'Add Payment Method',
      'This feature will be available soon!',
      [{ text: 'OK' }]
    );
  };

  const handleSetDefault = (methodId: string) => {
    setSelectedMethod(methodId);
    Alert.alert(
      'Default Payment Method',
      'Payment method set as default',
      [{ text: 'OK' }]
    );
  };

  const handleRemoveMethod = (methodId: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => console.log('Remove method') }
      ]
    );
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <View
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedMethod === method.id && styles.selectedPaymentMethod
      ]}
    >
      <TouchableOpacity
        style={styles.paymentMethodContent}
        onPress={() => setSelectedMethod(method.id)}
      >
        <View style={styles.paymentMethodInfo}>
          <View style={styles.paymentMethodIcon}>
            {method.icon}
          </View>
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodName}>{method.name}</Text>
            {method.details && (
              <Text style={styles.paymentMethodDescription}>{method.details}</Text>
            )}
            {method.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.paymentMethodActions}>
          {selectedMethod === method.id && (
            <CheckIcon size="md" variant="success" />
          )}
        </View>
      </TouchableOpacity>
      
      {method.type === 'card' && (
        <View style={styles.paymentMethodOptions}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleSetDefault(method.id)}
          >
            <Text style={styles.optionButtonText}>Set as Default</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleRemoveMethod(method.id)}
          >
            <Text style={[styles.optionButtonText, styles.removeButtonText]}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0A28" />
      <LinearGradient
        colors={['#0F0A28', '#1E1440', '#190F32']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payment</Text>
          </View>

          {/* Add Payment Method */}
          <View style={styles.addPaymentSection}>
            <TouchableOpacity
              style={styles.addPaymentButton}
              onPress={handleAddPaymentMethod}
            >
              <PlusIcon size="md" variant="primary" />
              <Text style={styles.addPaymentText}>Add Payment Method</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentMethodsSection}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            {paymentMethods.map(renderPaymentMethod)}
          </View>

          {/* Payment History */}
          <View style={styles.paymentHistorySection}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            
            <View style={styles.paymentHistoryCard}>
              <View style={styles.paymentHistoryItem}>
                <View style={styles.paymentHistoryInfo}>
                  <Text style={styles.paymentHistoryTitle}>Cleaning Service</Text>
                  <Text style={styles.paymentHistoryDate}>Jan 15, 2024</Text>
                </View>
                <Text style={styles.paymentHistoryAmount}>R85.00</Text>
              </View>
              
              <View style={styles.paymentHistoryItem}>
                <View style={styles.paymentHistoryInfo}>
                  <Text style={styles.paymentHistoryTitle}>Express Service</Text>
                  <Text style={styles.paymentHistoryDate}>Jan 12, 2024</Text>
                </View>
                <Text style={styles.paymentHistoryAmount}>R65.00</Text>
              </View>
              
              <View style={styles.paymentHistoryItem}>
                <View style={styles.paymentHistoryInfo}>
                  <Text style={styles.paymentHistoryTitle}>Premium Cleaning</Text>
                  <Text style={styles.paymentHistoryDate}>Jan 10, 2024</Text>
                </View>
                <Text style={styles.paymentHistoryAmount}>R120.00</Text>
              </View>
            </View>
          </View>

          {/* Promotions */}
          <View style={styles.promotionsSection}>
            <Text style={styles.sectionTitle}>Promotions</Text>
            
            <View style={styles.promotionCard}>
              <View style={styles.promotionContent}>
                <Text style={styles.promotionTitle}>First Time User</Text>
                <Text style={styles.promotionDescription}>
                  Get 20% off your first cleaning service
                </Text>
                <Text style={styles.promotionCode}>Code: WELCOME20</Text>
              </View>
              <SecondaryButton
                size="sm"
                onPress={() => console.log('Apply promotion')}
                style={styles.promotionButton}
              >
                Apply
              </SecondaryButton>
            </View>
          </View>

          {/* Support */}
          <View style={styles.supportSection}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <Text style={styles.supportText}>
              Having trouble with payments? Contact our support team.
            </Text>
            <SecondaryButton
              size="md"
              onPress={() => console.log('Contact support')}
              style={styles.supportButton}
            >
              Contact Support
            </SecondaryButton>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A28',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  // Add Payment Section
  addPaymentSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    borderStyle: 'dashed',
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 12,
  },

  // Payment Methods Section
  paymentMethodsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  paymentMethodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    marginRight: 16,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  defaultBadge: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  paymentMethodActions: {
    alignItems: 'center',
  },
  paymentMethodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  removeButtonText: {
    color: COLORS.error,
  },

  // Payment History Section
  paymentHistorySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  paymentHistoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  paymentHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  paymentHistoryInfo: {
    flex: 1,
  },
  paymentHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  paymentHistoryDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  paymentHistoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Promotions Section
  promotionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  promotionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  promotionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  promotionCode: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  promotionButton: {
    paddingHorizontal: 16,
  },

  // Support Section
  supportSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  supportText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  supportButton: {
    paddingHorizontal: 32,
  },
});


