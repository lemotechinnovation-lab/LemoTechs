#!/usr/bin/env node

/**
 * Firebase Configuration Verification Script
 * 
 * This script verifies that your Firebase configuration is correct
 * Run with: node scripts/verify-firebase.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Configuration Verification\n');

const envPath = path.join(__dirname, '..', '.env');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Run: node scripts/setup-firebase.js');
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    envVars[key.trim()] = value.trim();
  }
});

// Required Firebase variables
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

console.log('📋 Checking required environment variables...\n');

let allPresent = true;

requiredVars.forEach(varName => {
  if (envVars[varName] && envVars[varName] !== 'your_value_here') {
    console.log(`✅ ${varName}: ${envVars[varName].substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Missing or not configured`);
    allPresent = false;
  }
});

// Optional variables
console.log('\n📋 Checking optional environment variables...\n');

const optionalVars = ['VITE_FIREBASE_MEASUREMENT_ID'];

optionalVars.forEach(varName => {
  if (envVars[varName] && envVars[varName] !== 'your_value_here') {
    console.log(`✅ ${varName}: ${envVars[varName].substring(0, 20)}...`);
  } else {
    console.log(`⚠️  ${varName}: Not configured (optional)`);
  }
});

// Validation checks
console.log('\n🔍 Running validation checks...\n');

// Check API key format
if (envVars.VITE_FIREBASE_API_KEY) {
  if (envVars.VITE_FIREBASE_API_KEY.startsWith('AIza')) {
    console.log('✅ API Key format looks correct');
  } else {
    console.log('⚠️  API Key format might be incorrect (should start with "AIza")');
  }
}

// Check auth domain format
if (envVars.VITE_FIREBASE_AUTH_DOMAIN) {
  if (envVars.VITE_FIREBASE_AUTH_DOMAIN.includes('.firebaseapp.com')) {
    console.log('✅ Auth Domain format looks correct');
  } else {
    console.log('⚠️  Auth Domain format might be incorrect (should end with ".firebaseapp.com")');
  }
}

// Check storage bucket format
if (envVars.VITE_FIREBASE_STORAGE_BUCKET) {
  if (envVars.VITE_FIREBASE_STORAGE_BUCKET.includes('.appspot.com')) {
    console.log('✅ Storage Bucket format looks correct');
  } else {
    console.log('⚠️  Storage Bucket format might be incorrect (should end with ".appspot.com")');
  }
}

// Check app ID format
if (envVars.VITE_FIREBASE_APP_ID) {
  if (envVars.VITE_FIREBASE_APP_ID.includes(':')) {
    console.log('✅ App ID format looks correct');
  } else {
    console.log('⚠️  App ID format might be incorrect (should contain ":")');
  }
}

// Summary
console.log('\n📊 Summary:');

if (allPresent) {
  console.log('✅ All required Firebase environment variables are configured!');
  console.log('\n🎉 Your Firebase configuration looks good!');
  console.log('\nNext steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Navigate to the login page');
  console.log('3. Test the Google and Apple sign-in buttons');
  console.log('4. Check browser console for any errors');
} else {
  console.log('❌ Some required environment variables are missing or not configured.');
  console.log('\nTo fix this:');
  console.log('1. Run: node scripts/setup-firebase.js');
  console.log('2. Or manually edit the .env file with your Firebase configuration');
  console.log('3. Get your Firebase config from: Firebase Console → Project Settings → General');
}

console.log('\n📚 For detailed setup instructions, see: docs/FIREBASE_SOCIAL_AUTH_SETUP.md');
