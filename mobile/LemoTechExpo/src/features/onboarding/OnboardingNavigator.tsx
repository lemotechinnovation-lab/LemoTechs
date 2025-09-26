import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton, SecondaryButton } from '../../design-system';
import { COLORS } from '../../constants/app';

type OnboardingStackParamList = {
  Phone: undefined;
  Verify: { phone: string } | undefined;
  Terms: { phone: string } | undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

const ScreenContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LinearGradient colors={[ '#0F0A28', '#1E1440', '#190F32' ]} style={styles.container}>
    <View style={styles.content}>{children}</View>
  </LinearGradient>
);

const PhoneScreen = ({ navigation }: any) => {
  const [phone, setPhone] = React.useState('');
  return (
    <ScreenContainer>
      <Text style={styles.title}>What's your phone number?</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="e.g. +27 63 332 6210"
        placeholderTextColor="rgba(255,255,255,0.5)"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <PrimaryButton fullWidth disabled={!phone.trim()} onPress={() => navigation.navigate('Verify', { phone })}>
        Continue
      </PrimaryButton>
      <View style={{ height: 12 }} />
      <SecondaryButton fullWidth onPress={() => navigation.navigate('Terms', { phone })}>
        Continue without SMS
      </SecondaryButton>
    </ScreenContainer>
  );
};

const VerifyScreen = ({ route, navigation }: any) => {
  const { phone } = route.params || { phone: '' };
  const [code, setCode] = React.useState('');
  return (
    <ScreenContainer>
      <Text style={styles.title}>Enter the 4‑digit code</Text>
      <Text style={styles.subtitle}>Sent to {phone || 'your phone'}</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="1234"
        placeholderTextColor="rgba(255,255,255,0.5)"
        keyboardType="number-pad"
        style={styles.input}
        maxLength={6}
      />
      <PrimaryButton fullWidth disabled={code.length < 4} onPress={() => navigation.navigate('Terms', { phone })}>
        Next
      </PrimaryButton>
      <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setCode('')}>
        <Text style={styles.link}>Resend code by SMS</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

const TermsScreen = ({ navigation }: any) => {
  const [checked, setChecked] = React.useState(true);
  const complete = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    // Prefer replacing root with MainTabs to avoid nesting issues
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Service' } }]
    });
  };
  return (
    <ScreenContainer>
      <Text style={styles.title}>Accept LemoTech's Terms</Text>
      <Text style={styles.subtitle}>and Review Privacy Notice</Text>
      <TouchableOpacity onPress={() => setChecked(!checked)} style={styles.checkboxRow}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
        <Text style={styles.checkboxText}>I agree</Text>
      </TouchableOpacity>
      <PrimaryButton fullWidth disabled={!checked} onPress={complete}>
        Finish
      </PrimaryButton>
    </ScreenContainer>
  );
};

export const OnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Phone" component={PhoneScreen} />
    <Stack.Screen name="Verify" component={VerifyScreen} />
    <Stack.Screen name="Terms" component={TermsScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { color: COLORS.white, fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16
  },
  link: { color: COLORS.primary, textAlign: 'center' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 12 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: COLORS.primary, marginRight: 8 },
  checkboxChecked: { backgroundColor: COLORS.primary },
  checkboxText: { color: COLORS.white, fontSize: 14 }
});


