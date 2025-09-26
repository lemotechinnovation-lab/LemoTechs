/**
 * Utility functions for data validation
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (South African format)
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check various SA formats
  return (
    // +27 format (11 digits total)
    (cleaned.startsWith('27') && cleaned.length === 11) ||
    // 0 format (10 digits total)
    (cleaned.startsWith('0') && cleaned.length === 10) ||
    // Just the number without country code (9 digits)
    (cleaned.length === 9 && !cleaned.startsWith('0'))
  );
};

// Password validation
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
};

// Address validation
export const isValidAddress = (address: string): boolean => {
  return address.trim().length >= 10;
};

// Amount validation
export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000 && Number.isFinite(amount);
};

// Required field validation
export const isRequired = (value: string | number | boolean | null | undefined): boolean => {
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  if (typeof value === 'boolean') {
    return true; // Booleans are always valid
  }
  return value !== null && value !== undefined;
};

// South African ID number validation
export const isValidSAIDNumber = (idNumber: string): boolean => {
  // Remove any spaces or hyphens
  const cleaned = idNumber.replace(/[\s-]/g, '');
  
  // Must be exactly 13 digits
  if (!/^\d{13}$/.test(cleaned)) {
    return false;
  }
  
  // Luhn algorithm check
  const checkDigit = parseInt(cleaned.charAt(12));
  const digits = cleaned.substring(0, 12);
  
  let sum = 0;
  let even = true;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (even) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    
    sum += digit;
    even = !even;
  }
  
  return (10 - (sum % 10)) % 10 === checkDigit;
};

// URL validation
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Credit card validation (basic Luhn algorithm)
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and hyphens
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Must be 13-19 digits
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let even = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (even) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    
    sum += digit;
    even = !even;
  }
  
  return sum % 10 === 0;
};

// Form validation helper
export interface ValidationRule {
  field: string;
  value: any;
  rules: Array<{
    validator: (value: any) => boolean;
    message: string;
  }>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export const validateForm = (rules: ValidationRule[]): ValidationResult => {
  const errors: Record<string, string[]> = {};
  
  for (const rule of rules) {
    const fieldErrors: string[] = [];
    
    for (const validation of rule.rules) {
      if (!validation.validator(rule.value)) {
        fieldErrors.push(validation.message);
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[rule.field] = fieldErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const validationRules = {
  required: (value: any) => isRequired(value),
  email: (value: string) => isValidEmail(value),
  phone: (value: string) => isValidPhoneNumber(value),
  name: (value: string) => isValidName(value),
  address: (value: string) => isValidAddress(value),
  amount: (value: number) => isValidAmount(value),
  saId: (value: string) => isValidSAIDNumber(value),
  url: (value: string) => isValidURL(value),
  creditCard: (value: string) => isValidCreditCard(value),
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max,
  pattern: (regex: RegExp) => (value: string) => regex.test(value),
  equals: (compareValue: any) => (value: any) => value === compareValue,
};
