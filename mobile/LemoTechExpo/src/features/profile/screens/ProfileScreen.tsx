import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  PrimaryButton, 
  LemoButton,
  SecondaryButton,
  SettingsIcon,
  NotificationIcon,
  HeartIcon,
  StarIcon,
  CardIcon,
  ClockIcon,
  HomeIcon
} from '../../../design-system';
import { COLORS, APP_NAME, CONTACT_INFO } from '../../../constants/app';

interface ProfileScreenProps {
  navigation?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const handleEditProfile = () => {
    console.log('Edit Profile');
  };

  const handleSettings = () => {
    console.log('Settings');
  };

  const handleSupport = () => {
    console.log('Support');
  };

  const handleSignOut = () => {
    console.log('Sign Out');
  };

  const menuItems = [
    {
      icon: <SettingsIcon size="md" variant="default" />,
      title: 'Settings',
      subtitle: 'Account preferences and privacy',
      onPress: handleSettings
    },
    {
      icon: <NotificationIcon size="md" variant="default" />,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => console.log('Notifications')
    },
    {
      icon: <HeartIcon size="md" variant="default" />,
      title: 'Favorites',
      subtitle: 'Your saved locations and preferences',
      onPress: () => console.log('Favorites')
    },
    {
      icon: <StarIcon size="md" variant="default" />,
      title: 'Rate Us',
      subtitle: 'Help us improve our service',
      onPress: () => console.log('Rate Us')
    },
    {
      icon: <CardIcon size="md" variant="default" />,
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => navigation?.navigate('Payment')
    },
    {
      icon: <ClockIcon size="md" variant="default" />,
      title: 'Trip History',
      subtitle: 'View your past bookings',
      onPress: () => navigation?.navigate('Trips')
    }
  ];

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
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userPhone}>+27 82 123 4567</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>R2,450</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuIcon}>
                  {item.icon}
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Support Section */}
          <View style={styles.supportSection}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <Text style={styles.supportText}>
              Contact our support team for assistance
            </Text>
            <SecondaryButton
              size="md"
              onPress={handleSupport}
              style={styles.supportButton}
            >
              Contact Support
            </SecondaryButton>
          </View>

          {/* Sign Out */}
          <View style={styles.signOutSection}>
            <LemoButton
              variant="danger"
              size="md"
              onPress={handleSignOut}
              style={styles.signOutButton}
            >
              Sign Out
            </LemoButton>
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

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },

  // Menu Section
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  menuArrow: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
  },

  // Support Section
  supportSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 40,
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

  // Sign Out Section
  signOutSection: {
    paddingHorizontal: 20,
  },
  signOutButton: {
    backgroundColor: COLORS.error,
  },
});


