import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens from feature barrels
import { BookingScreen } from '../features/booking';
import { ProfileScreen } from '../features/profile';

// Import design system components
import { 
  CleanIcon, 
  ProfileIcon
} from '../design-system';

// Import constants
import { COLORS } from '../constants/app';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Service"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0F0A28',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Service"
        component={BookingScreen}
        options={{
          tabBarLabel: 'Service',
          tabBarIcon: ({ color, size }) => (
            <CleanIcon size="md" variant="default" />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon size="md" variant="default" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
export function AppNavigator() {
  const [isOnboarded, setIsOnboarded] = React.useState<boolean | null>(null);
  // TEMP: Force onboarding during end-to-end buildout. Toggle to false to restore normal behavior.
  const FORCE_ONBOARDING = true;
  React.useEffect(() => {
    (async () => {
      if (FORCE_ONBOARDING) {
        setIsOnboarded(false);
        return;
      }
      const flag = await AsyncStorage.getItem('onboardingCompleted');
      setIsOnboarded(flag === 'true');
    })();
  }, []);

  // Lazy import to avoid circular deps
  const OnboardingNavigator = React.useMemo(() => require('../features/onboarding/OnboardingNavigator').OnboardingNavigator, []);

  if (!FORCE_ONBOARDING && isOnboarded === null) {
    // Wait until onboarding flag is loaded to avoid incorrect initial screen
    return null;
  }

  const initialRouteName = FORCE_ONBOARDING
    ? 'Onboarding'
    : (isOnboarded ? 'MainTabs' : 'Onboarding');

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#0F0A28" />
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0F0A28' },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        {/* Add modal screens here if needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
