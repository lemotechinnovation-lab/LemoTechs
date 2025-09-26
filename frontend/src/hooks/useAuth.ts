import { useState, useCallback, useEffect } from 'react';
import { FirebaseAuthService } from '../services/firebaseService';
import { BackendAuthService } from '../services/backendAuthService';
import { authApiService } from '../services/authApiService';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: Date;
  totalBookings: number;
  loyaltyPoints: number;
  avatar?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role?: 'user' | 'driver' | 'shop' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  acceptTerms: boolean;
}

export interface UseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showAuthDialog: boolean;
  authMode: 'login' | 'register' | 'forgot-password';
}

export interface UseAuthActions {
  // Authentication
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  
  // Phone Authentication
  signInWithPhoneNumber: (phoneNumber: string) => Promise<string>;
  verifyPhoneNumber: (verificationId: string, code: string) => Promise<boolean>;
  
  // Social Authentication
  signInWithGoogle: () => Promise<boolean>;
  signInWithMicrosoft: () => Promise<boolean>;
  
  // Password
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
  // Profile
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  verifyPhone: (code: string) => Promise<boolean>;
  
  // UI State
  openAuthDialog: (mode?: 'login' | 'register' | 'forgot-password') => void;
  closeAuthDialog: () => void;
  setAuthMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  
  // Utility
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const STORAGE_KEY = 'lemotech_user';
const TOKEN_KEY = 'lemotech_token';

const initialState: UseAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  showAuthDialog: false,
  authMode: 'login',
};

export const useAuth = (): UseAuthState & UseAuthActions => {
  const [state, setState] = useState<UseAuthState>(initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_KEY);
        
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          
          setState(prev => ({
            ...prev,
            user: {
              ...user,
              memberSince: new Date(user.memberSince)
            },
            isAuthenticated: true
          }));
          
        }
      } catch (error) {
        console.error('🔥 useAuth: Failed to load stored user:', error);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    };

    loadStoredUser();
  }, []);

  // Authentication
  const login = useCallback(async (data: LoginData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔥 useAuth: Attempting login with:', data.email);
      
      // Try real API first
      try {
        const authResponse = await authApiService.login(data);
        console.log('🔥 useAuth: API login successful:', authResponse);
        
        // Convert API user to our User format
        const user: User = {
          id: authResponse.user.id,
          name: authResponse.user.name,
          email: authResponse.user.email,
          phone: authResponse.user.phone,
          address: authResponse.user.address,
          memberSince: new Date(authResponse.user.memberSince),
          totalBookings: authResponse.user.totalBookings,
          loyaltyPoints: authResponse.user.loyaltyPoints,
          avatar: authResponse.user.avatar,
          emailVerified: authResponse.user.emailVerified,
          phoneVerified: authResponse.user.phoneVerified,
          role: authResponse.user.role
        };
        
        // Store user data
        authApiService.storeUser(authResponse.user);
        
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          showAuthDialog: false
        }));
        
        return true;
      } catch (apiError) {
        console.log('🔥 useAuth: API login failed, trying demo credentials:', apiError);
        
        // Fallback to demo credentials for development
        if (data.email === 'demo@lemotech.co.za' && data.password === 'demo123') {
          const demoUser: User = {
            id: 'demo-user-123',
            name: 'John Doe',
            email: 'demo@lemotech.co.za',
            phone: '+27 82 123 4567',
            address: '123 Main St, Sandton, Johannesburg',
            memberSince: new Date(2023, 0, 1),
            totalBookings: 15,
            loyaltyPoints: 350,
            avatar: '/api/placeholder/150/150',
            emailVerified: true,
            phoneVerified: true,
            role: 'user'
          };
          
          const token = 'demo_token_' + Date.now();
          
          // Store in localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
          localStorage.setItem(TOKEN_KEY, token);
          
          setState(prev => ({
            ...prev,
            user: demoUser,
            isAuthenticated: true,
            isLoading: false,
            showAuthDialog: false
          }));
          
          return true;
        } else {
          throw apiError; // Re-throw API error for non-demo credentials
        }
      }
    } catch (error) {
      console.error('🔥 useAuth: Login error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        setState(prev => ({
          ...prev,
          error: 'Passwords do not match',
          isLoading: false
        }));
        return false;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        memberSince: new Date(),
        totalBookings: 0,
        loyaltyPoints: 100, // Welcome bonus
        avatar: '/api/placeholder/150/150',
        emailVerified: false,
        phoneVerified: false
      };
      
      const token = 'token_' + Date.now();
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(TOKEN_KEY, token);
      
      setState(prev => ({
        ...prev,
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        showAuthDialog: false
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setState({
      ...initialState,
      showAuthDialog: false
    });
  }, []);

  // Phone Authentication
  const signInWithPhoneNumber = useCallback(async (phoneNumber: string): Promise<string> => {
    console.log('🔥 useAuth: signInWithPhoneNumber called with:', phoneNumber);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔥 useAuth: Sending phone verification via backend...');
      const result = await BackendAuthService.sendPhoneVerification(phoneNumber);
      console.log('🔥 useAuth: Backend response received:', result);
      
      // Store the verification code from backend
      const verificationId = 'backend_verification_' + Date.now();
      const verificationCode = result.data?.verificationCode;
      
      if (!verificationCode) {
        throw new Error('No verification code received from server');
      }
      
      console.log('🔥 useAuth: Storing verification code:', verificationCode);
      
      localStorage.setItem('phone_verification_code', verificationCode);
      localStorage.setItem('phone_verification_id', verificationId);
      localStorage.setItem('phone_verification_phone', phoneNumber);
      
      // Log the verification code for development
      console.log('📱 Verification Code for', phoneNumber, ':', verificationCode);
      console.log('📱 Verification ID:', verificationId);
      console.log('📱 SMS Mode:', result.data?.smsSent ? 'Real SMS sent' : 'Console logging mode');
      console.log('📱 Stored in localStorage:', {
        code: localStorage.getItem('phone_verification_code'),
        id: localStorage.getItem('phone_verification_id')
      });
      
      setState(prev => ({ ...prev, isLoading: false }));
      console.log('🔥 useAuth: Phone verification sent successfully');
      return verificationId;
    } catch (error) {
      console.error('🔥 useAuth: Phone verification error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send verification code',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  const verifyPhoneNumber = useCallback(async (_verificationId: string, code: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Get phone number from stored verification data
      const storedPhoneNumber = localStorage.getItem('phone_verification_phone');
      
      if (!storedPhoneNumber) {
        throw new Error('Phone number not found. Please start the verification process again.');
      }
      
      const result = await BackendAuthService.verifyPhoneNumber(storedPhoneNumber, code);
      
      if (result.success && result.data) {
        const { user, accessToken, refreshToken } = result.data;
        
        
        // Store in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Clean up verification data
        localStorage.removeItem('phone_verification_code');
        localStorage.removeItem('phone_verification_id');
        localStorage.removeItem('phone_verification_phone');
        
        console.log('🔥 useAuth: User stored in localStorage');
        
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          showAuthDialog: false
        }));
        
        console.log('🔥 useAuth: State updated, user authenticated:', user);
        return true;
      } else {
        throw new Error(result.message || 'Phone verification failed');
      }
    } catch (error) {
      console.error('🔥 useAuth: Phone verification error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Phone verification failed',
        isLoading: false
      }));
      return false;
    }
  }, []);

  // Social Authentication
  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    console.log('🔥 useAuth: Google Sign-In starting...');
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const firebaseUser = await FirebaseAuthService.signInWithGoogle();
      console.log('🔥 useAuth: Google Sign-In success, user:', firebaseUser);
      
      // Convert Firebase user to our User format
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || '',
        address: '',
        memberSince: firebaseUser.createdAt ?? new Date(),
        totalBookings: 0,
        loyaltyPoints: 100, // Welcome bonus for social login
        avatar: firebaseUser.photoURL || undefined,
        emailVerified: firebaseUser.emailVerified,
        phoneVerified: !!firebaseUser.phoneNumber
      };
      
      const token = await FirebaseAuthService.getIdToken();
      
      // Ensure we always have a token
      const finalToken = token || 'demo_token_' + Date.now();
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, finalToken);
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        showAuthDialog: false
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Google sign-in failed',
        isLoading: false
      }));
      return false;
    }
  }, []);

  const signInWithMicrosoft = useCallback(async (): Promise<boolean> => {
    console.log('🔥 useAuth: Microsoft Sign-In starting...');
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const firebaseUser = await FirebaseAuthService.signInWithMicrosoft();
      console.log('🔥 useAuth: Microsoft Sign-In success, user:', firebaseUser);
      
      // Convert Firebase user to our User format
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Microsoft User',
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || '',
        address: '',
        memberSince: firebaseUser.createdAt ?? new Date(),
        totalBookings: 0,
        loyaltyPoints: 100, // Welcome bonus for social login
        avatar: firebaseUser.photoURL || undefined,
        emailVerified: firebaseUser.emailVerified,
        phoneVerified: !!firebaseUser.phoneNumber
      };
      
      const token = await FirebaseAuthService.getIdToken();
      
      // Ensure we always have a token
      const finalToken = token || 'demo_token_' + Date.now();
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, finalToken);
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        showAuthDialog: false
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Microsoft sign-in failed',
        isLoading: false
      }));
      return false;
    }
  }, []);


  // Password management
  const forgotPassword = useCallback(async (_email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send reset email',
        isLoading: false
      }));
      return false;
    }
  }, []);

  const resetPassword = useCallback(async (_token: string, _newPassword: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to reset password',
        isLoading: false
      }));
      return false;
    }
  }, []);

  const changePassword = useCallback(async (_currentPassword: string, _newPassword: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to change password',
        isLoading: false
      }));
      return false;
    }
  }, []);

  // Profile management
  const updateProfile = useCallback(async (data: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...state.user, ...data };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false
      }));
      return false;
    }
  }, [state.user]);

  const verifyEmail = useCallback(async (_token: string): Promise<boolean> => {
    if (!state.user) return false;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...state.user, emailVerified: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      setState(prev => ({ ...prev, user: updatedUser }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to verify email'
      }));
      return false;
    }
  }, [state.user]);

  const verifyPhone = useCallback(async (_code: string): Promise<boolean> => {
    if (!state.user) return false;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...state.user, phoneVerified: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      setState(prev => ({ ...prev, user: updatedUser }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to verify phone'
      }));
      return false;
    }
  }, [state.user]);

  // UI State
  const openAuthDialog = useCallback((mode: 'login' | 'register' | 'forgot-password' = 'login') => {
    setState(prev => ({
      ...prev,
      showAuthDialog: true,
      authMode: mode,
      error: null
    }));
  }, []);

  const closeAuthDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      showAuthDialog: false,
      error: null
    }));
  }, []);

  const setAuthMode = useCallback((mode: 'login' | 'register' | 'forgot-password') => {
    setState(prev => ({ ...prev, authMode: mode, error: null }));
  }, []);

  // Utility
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.user) return;
    
    try {
      // Simulate API call to refresh user data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you'd fetch fresh user data from the server
      const refreshedUser = { ...state.user };
      setState(prev => ({ ...prev, user: refreshedUser }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [state.user]);

  return {
    ...state,
    login,
    register,
    logout,
    signInWithPhoneNumber,
    verifyPhoneNumber,
    signInWithGoogle,
    signInWithMicrosoft,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    verifyEmail,
    verifyPhone,
    openAuthDialog,
    closeAuthDialog,
    setAuthMode,
    clearError,
    refreshUser,
  };
};
