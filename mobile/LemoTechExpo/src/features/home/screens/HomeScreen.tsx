import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  PrimaryButton, 
  SecondaryButton,
  CleanIcon,
  StarIcon,
  CheckIcon,
  CarIcon,
  DeliveryIcon,
  HomeIcon,
  ClockIcon
} from '../../../design-system';
import { COLORS, APP_NAME, CONTACT_INFO } from '../../../constants/app';
const logo = require('../../../../assets/lemotech-logo.png');

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const features = [
    {
      icon: <CleanIcon size="lg" variant="primary" />,
      title: 'Professional Cleaning',
      description: 'Expert cleaning services using industry-leading techniques and eco-friendly solutions.'
    },
    {
      icon: <ClockIcon size="lg" variant="primary" />,
      title: 'Fast Turnaround',
      description: 'Quick and reliable service with 24-48 hour standard delivery for most items.'
    },
    {
      icon: <CheckIcon size="lg" variant="primary" />,
      title: 'Secure & Trusted',
      description: 'Your items are in safe hands with our verified drivers and secure handling process.'
    }
  ];

  const trustSignals = [
    {
      icon: <StarIcon size="md" variant="warning" />,
      number: '10,000+',
      label: 'Happy Customers'
    },
    {
      icon: <StarIcon size="md" variant="warning" />,
      number: '4.9',
      label: 'Average Rating'
    },
    {
      icon: <CheckIcon size="md" variant="success" />,
      number: '100%',
      label: 'Satisfaction Guarantee'
    },
    {
      icon: <CleanIcon size="md" variant="primary" />,
      number: '50,000+',
      label: 'Items Cleaned'
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
          {/* Hero Section */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Animated.Image source={logo} style={styles.logoImage} />
              <Text style={styles.logoText}>{APP_NAME}</Text>
              <Text style={styles.logoSubtext}>Professional Cleaning Services</Text>
            </View>

            <Text style={styles.heroTitle}>
              Clean, Fast, Reliable
            </Text>
            <Text style={styles.heroSubtitle}>
              Professional cleaning services for your shoes, clothing, and more. 
              Book now and experience the difference.
            </Text>

            <View style={styles.ctaButtons}>
              <PrimaryButton
                size="lg"
                fullWidth
                onPress={() => navigation?.navigate('Book')}
                style={styles.primaryCTA}
              >
                Start Cleaning
              </PrimaryButton>
              <SecondaryButton
                size="lg"
                fullWidth
                onPress={() => navigation?.navigate('Book')}
                style={styles.secondaryCTA}
              >
                View Services
              </SecondaryButton>
            </View>
          </Animated.View>

          {/* Features Section */}
          <Animated.View
            style={[
              styles.featuresSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Why Choose {APP_NAME}?</Text>
            
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  {feature.icon}
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </Animated.View>

          {/* Trust Signals */}
          <Animated.View
            style={[
              styles.trustSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Trusted by Thousands</Text>
            <View style={styles.trustGrid}>
              {trustSignals.map((signal, index) => (
                <View key={index} style={styles.trustCard}>
                  <View style={styles.trustIcon}>
                    {signal.icon}
                  </View>
                  <Text style={styles.trustNumber}>{signal.number}</Text>
                  <Text style={styles.trustLabel}>{signal.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Service Types */}
          <Animated.View
            style={[
              styles.servicesSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Our Services</Text>
            
            <View style={styles.serviceCards}>
              <View style={styles.serviceCard}>
                <CleanIcon size="xl" variant="primary" />
                <Text style={styles.serviceTitle}>Clean</Text>
                <Text style={styles.serviceDescription}>
                  Professional cleaning for shoes, clothing, and accessories
                </Text>
                <SecondaryButton
                  size="sm"
                  onPress={() => navigation?.navigate('Book')}
                  style={styles.serviceButton}
                >
                  Book Now
                </SecondaryButton>
              </View>

              <View style={styles.serviceCard}>
                <CarIcon size="xl" variant="primary" />
                <Text style={styles.serviceTitle}>Drive</Text>
                <Text style={styles.serviceDescription}>
                  On-demand delivery and pickup services
                </Text>
                <SecondaryButton
                  size="sm"
                  onPress={() => navigation?.navigate('Book')}
                  style={styles.serviceButton}
                >
                  Book Now
                </SecondaryButton>
              </View>
            </View>
          </Animated.View>

          {/* Contact Section */}
          <Animated.View
            style={[
              styles.contactSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <Text style={styles.contactText}>
              Have questions? We're here to help!
            </Text>
            <Text style={styles.contactInfo}>
              📞 {CONTACT_INFO.phone}
            </Text>
            <Text style={styles.contactInfo}>
              📧 {CONTACT_INFO.email}
            </Text>
            <SecondaryButton
              size="md"
              onPress={() => console.log('Contact Us')}
              style={styles.contactButton}
            >
              Contact Us
            </SecondaryButton>
          </Animated.View>
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

  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  logoImage: {
    width: 96,
    height: 96,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 300,
  },
  ctaButtons: {
    width: '100%',
    gap: 16,
  },
  primaryCTA: {
    marginBottom: 8,
  },
  secondaryCTA: {
    marginBottom: 0,
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIcon: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },

  // Trust Section
  trustSection: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trustCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  trustIcon: {
    marginBottom: 12,
  },
  trustNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  trustLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Services Section
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  serviceCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 16,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  serviceButton: {
    width: '100%',
  },

  // Contact Section
  contactSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },
  contactButton: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
});


