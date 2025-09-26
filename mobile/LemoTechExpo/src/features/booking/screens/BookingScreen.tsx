import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  PrimaryButton, 
  SecondaryButton,
  BackIcon,
  LocationIcon,
  CleanIcon,
  ClockIcon,
  CardIcon,
  CashIcon,
  MobileIcon,
  CheckIcon
} from '../../../design-system';
import { COLORS } from '../../../constants/app';
import { ITEM_CATALOG } from '../../../constants/items';
import { getCurrentPosition, getPlaceSuggestions, geocodePlaceId } from '../../../services/places';

const { width, height } = Dimensions.get('window');

// Uber-style booking states
type BookingState = 'location' | 'items' | 'carType' | 'confirming';

interface BookingData {
  location: string;
  coordinates: { lat: number; lng: number } | null;
  items: { [key: string]: number };
  carType: 'sedan' | 'suv' | 'van' | 'truck';
  scheduledFor: 'now' | 'later';
  scheduledDate?: Date;
  scheduledTime?: string;
  paymentMethod: 'card' | 'cash' | 'mobile';
  specialInstructions: string;
  contactPhone: string;
  userEmail?: string;
  isLoggedIn: boolean;
}

interface CleaningItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  popular?: boolean;
}

interface BookingScreenProps {
  navigation?: any;
}

// Use shared catalog
const popularItems: CleaningItem[] = ITEM_CATALOG;

export const BookingScreen: React.FC<BookingScreenProps> = ({
  navigation
}) => {
  console.log('🚀 BookingScreen component loaded - THIS SHOULD APPEAR IN CONSOLE');
  const [currentState, setCurrentState] = useState<BookingState>('location');
  const [bookingData, setBookingData] = useState<BookingData>({
    location: '',
    coordinates: null,
    items: {},
    carType: 'sedan',
    scheduledFor: 'now',
    paymentMethod: 'card',
    specialInstructions: '',
    contactPhone: '',
    userEmail: '',
    isLoggedIn: false,
  });

  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string; description: string; placeId?: string }[]>([]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentState]);

  const nextStep = () => {
    const steps: BookingState[] = ['location', 'items', 'carType', 'confirming'];
    const currentIndex = steps.indexOf(currentState);
    if (currentIndex < steps.length - 1) {
      setCurrentState(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: BookingState[] = ['location', 'items', 'carType', 'confirming'];
    const currentIndex = steps.indexOf(currentState);
    if (currentIndex > 0) {
      setCurrentState(steps[currentIndex - 1]);
    } else {
      navigation?.goBack();
    }
  };

  const updateBookingData = (updates: Partial<BookingData>) => {
    console.log('🔥🔥🔥 UPDATING BOOKING DATA:', updates);
    setBookingData(prev => {
      const newData = { ...prev, ...updates };
      console.log('🔥🔥🔥 NEW BOOKING DATA:', newData);
      return newData;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(bookingData.items).forEach(([itemId, quantity]) => {
      const item = popularItems.find(i => i.id === itemId);
      if (item) {
        total += item.price * quantity;
      }
    });

    return total;
  };

  const renderLocationStep = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0]
          })}]
        }
      ]}
    >
      <Text style={styles.stepTitle}>Where should we collect?</Text>
      <Text style={styles.stepSubtitle}>Enter your pickup location to get started</Text>
      
      {/* Debug info - remove this later */}
      <Text style={styles.debugText}>
        Current location: "{bookingData.location}" (Length: {bookingData.location.length})
      </Text>
      
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={async () => {
          const coords = await getCurrentPosition();
          if (coords) {
            updateBookingData({ coordinates: { lat: coords.latitude, lng: coords.longitude }, location: 'Current location' });
          }
        }}
      >
        <LocationIcon size="md" variant="primary" />
        <Text style={styles.locationText}>Use current location</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.addressInput}
          placeholder="Search address"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={query}
          onChangeText={async (text) => {
            setQuery(text);
            updateBookingData({ location: text });
            const res = await getPlaceSuggestions(text);
            setSuggestions(res);
          }}
        />
        {suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            <FlatList
              data={suggestions}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={async () => {
                    setQuery(item.description);
                    updateBookingData({ location: item.description });
                    setSuggestions([]);
                    if (item.placeId) {
                      const coords = await geocodePlaceId(item.placeId);
                      if (coords) updateBookingData({ coordinates: { lat: coords.latitude, lng: coords.longitude } });
                    }
                  }}
                >
                  <Text style={styles.suggestionText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>Recent Locations</Text>
        <TouchableOpacity 
          style={styles.recentItem}
          onPress={() => {
            setQuery('Home');
            updateBookingData({ location: 'Home' });
            setSuggestions([]);
          }}
        >
          <LocationIcon size="sm" variant="muted" />
          <Text style={styles.recentText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.recentItem}
          onPress={() => {
            setQuery('Office');
            updateBookingData({ location: 'Office' });
            setSuggestions([]);
          }}
        >
          <LocationIcon size="sm" variant="muted" />
          <Text style={styles.recentText}>Office</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );


  const renderItemsStep = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0]
          })}]
        }
      ]}
    >
      <Text style={styles.stepTitle}>What needs cleaning?</Text>
      <Text style={styles.stepSubtitle}>Select the items you'd like us to clean</Text>
      
      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        {popularItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrice}>R{item.price}</Text>
              </View>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  const currentQty = bookingData.items[item.id] || 0;
                  if (currentQty > 0) {
                    updateBookingData({
                      items: { ...bookingData.items, [item.id]: currentQty - 1 }
                    });
                  }
                }}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {bookingData.items[item.id] || 0}
              </Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  const currentQty = bookingData.items[item.id] || 0;
                  updateBookingData({
                    items: { ...bookingData.items, [item.id]: currentQty + 1 }
                  });
                }}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderCarTypeStep = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0]
          })}]
        }
      ]}
    >
      <Text style={styles.stepTitle}>Choose your vehicle</Text>
      <Text style={styles.stepSubtitle}>Select the type of vehicle for pickup</Text>
      
      <View style={styles.carTypeContainer}>
        {[
          { type: 'sedan', name: 'Sedan', icon: '🚗', description: 'Perfect for small items', capacity: 'Up to 4 bags' },
          { type: 'suv', name: 'SUV', icon: '🚙', description: 'Great for medium loads', capacity: 'Up to 8 bags' },
          { type: 'van', name: 'Van', icon: '🚐', description: 'Ideal for large items', capacity: 'Up to 15 bags' },
          { type: 'truck', name: 'Truck', icon: '🚛', description: 'Maximum capacity', capacity: 'Up to 25 bags' }
        ].map((car) => (
          <TouchableOpacity
            key={car.type}
            style={[
              styles.carTypeCard,
              bookingData.carType === car.type && styles.carTypeCardSelected
            ]}
            onPress={() => updateBookingData({ carType: car.type as any })}
          >
            <Text style={styles.carTypeIcon}>{car.icon}</Text>
            <Text style={styles.carTypeName}>{car.name}</Text>
            <Text style={styles.carTypeDescription}>{car.description}</Text>
            <Text style={styles.carTypeCapacity}>{car.capacity}</Text>
            {bookingData.carType === car.type && (
              <View style={styles.selectedIndicator}>
                <CheckIcon size="sm" variant="primary" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderConfirmingStep = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0]
          })}]
        }
      ]}
    >
      <Text style={styles.stepTitle}>Confirm your booking</Text>
      <Text style={styles.stepSubtitle}>Review your details before proceeding</Text>
      
      <View style={styles.confirmationCard}>
        <View style={styles.confirmationSection}>
          <Text style={styles.confirmationLabel}>Location</Text>
          <Text style={styles.confirmationValue}>{bookingData.location || 'Not specified'}</Text>
        </View>
        
        <View style={styles.confirmationSection}>
          <Text style={styles.confirmationLabel}>Items</Text>
          {Object.entries(bookingData.items).map(([itemId, quantity]) => {
            const item = popularItems.find(i => i.id === itemId);
            return item && quantity > 0 ? (
              <Text key={itemId} style={styles.confirmationValue}>
                {item.name} x{quantity} - R{item.price * quantity}
              </Text>
            ) : null;
          })}
        </View>
        
        <View style={styles.confirmationSection}>
          <Text style={styles.confirmationLabel}>Service Type</Text>
          <Text style={styles.confirmationValue}>Standard</Text>
        </View>
        
        <View style={styles.confirmationSection}>
          <Text style={styles.confirmationLabel}>Vehicle Type</Text>
          <Text style={styles.confirmationValue}>
            {bookingData.carType.charAt(0).toUpperCase() + bookingData.carType.slice(1)}
          </Text>
        </View>
        
        <View style={styles.confirmationSection}>
          <Text style={styles.confirmationLabel}>Schedule</Text>
          <Text style={styles.confirmationValue}>
            {bookingData.scheduledFor === 'now' ? 'As soon as possible' : 'Scheduled'}
          </Text>
        </View>
        
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R{calculateTotal()}</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderCurrentStep = () => {
    switch (currentState) {
      case 'location':
        return renderLocationStep();
      case 'items':
        return renderItemsStep();
      case 'carType':
        return renderCarTypeStep();
      case 'confirming':
        return renderConfirmingStep();
      default:
        return renderLocationStep();
    }
  };

  const canProceed = () => {
    switch (currentState) {
      case 'location':
        const hasLocation = bookingData.location.trim().length > 0;
        console.log('🚨🚨🚨 LOCATION CHECK:', { 
          location: bookingData.location, 
          trimmed: bookingData.location.trim(), 
          length: bookingData.location.trim().length,
          hasLocation 
        });
        return hasLocation;
      case 'items':
        return Object.values(bookingData.items).some(qty => qty > 0);
      case 'carType':
        return true; // Car type is always selected (defaults to sedan)
      case 'confirming':
        return true;
      default:
        return false;
    }
  };

  const getNextButtonText = () => {
    switch (currentState) {
      case 'location':
        return 'Continue';
      case 'items':
        return 'Choose Vehicle';
      case 'carType':
        return 'Review Booking';
      case 'confirming':
        return 'Confirm & Pay';
      default:
        return 'Continue';
    }
  };

  const handleNext = () => {
    if (currentState === 'confirming') {
      navigation?.navigate('Payment');
    } else {
      nextStep();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0A28" />
      <LinearGradient
        colors={['#0F0A28', '#1E1440', '#190F32']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={prevStep} style={styles.backButton}>
            <BackIcon size="md" variant="default" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${((['location', 'items', 'carType', 'confirming'].indexOf(currentState) + 1) / 4) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCurrentStep()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <PrimaryButton
            size="lg"
            fullWidth
            onPress={handleNext}
            disabled={!canProceed()}
            style={[
              styles.nextButton,
              { opacity: canProceed() ? 1 : 0.5 }
            ]}
          >
            {getNextButtonText()}
          </PrimaryButton>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
  },

  // Step Container
  stepContainer: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  debugText: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
  },

  // Location Step
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 30,
  },
  addressInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: COLORS.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  suggestionsBox: {
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)'
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  suggestionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14
  },
  recentContainer: {
    marginBottom: 40,
  },
  recentTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  recentText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },

  // Items Step
  itemsContainer: {
    maxHeight: height * 0.5,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },

  // Confirmation Step
  confirmationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmationSection: {
    marginBottom: 16,
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confirmationValue: {
    fontSize: 16,
    color: COLORS.white,
    lineHeight: 22,
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Processing Step (unused in simplified flow but kept for parity)
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  processingIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  processingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Confirmed Step (unused in simplified flow but kept for parity)
  confirmedContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  confirmedIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  confirmedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmedSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmedDetails: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Footer
  nextButton: {
    marginBottom: 0,
  },

  // Car Type Step
  carTypeContainer: {
    marginBottom: 40,
  },
  carTypeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  carTypeCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  carTypeIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 12,
  },
  carTypeName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  carTypeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 4,
  },
  carTypeCapacity: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


