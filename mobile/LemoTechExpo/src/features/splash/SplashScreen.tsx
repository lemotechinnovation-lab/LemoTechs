import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/app';

const { width } = Dimensions.get('window');

interface MobileSplashProps {
  onComplete: () => void;
  durationMs?: number;
}

const logo = require('../../../assets/lemotech-logo.png');
const bgPattern = require('../../../assets/tech-pattern.jpg');

export const MobileSplashScreen: React.FC<MobileSplashProps> = ({ onComplete, durationMs = 1800 }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;
  const progress = React.useRef(new Animated.Value(0)).current;
  const [progressPct, setProgressPct] = React.useState(0);
  const [message, setMessage] = React.useState('Starting...');

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    const msgs = [
      'Preparing app...',
      'Loading assets...',
      'Almost there...'
    ];

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgressPct(pct);
      setMessage(msgs[Math.min(msgs.length - 1, Math.floor((pct / 100) * msgs.length))]);
      progress.setValue(pct);
      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(onComplete, 200);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [durationMs, onComplete, opacity, translateY, progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [0, width * 0.6],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[ '#0F0A28', '#1E1440', '#190F32' ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ImageBackground source={bgPattern} resizeMode="cover" style={styles.bg} imageStyle={{ opacity: 0.08 }}>
          <Animated.Image source={logo} style={[styles.logo, { opacity, transform: [{ translateY }] }]} />
          <Animated.Text style={[styles.title, { opacity }]}>LemoTech</Animated.Text>
          <Text style={styles.subtitle}>Professional Cleaning Services</Text>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressText}>{message}  {progressPct}%</Text>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A28',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  progressTrack: {
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 8,
  },
});


