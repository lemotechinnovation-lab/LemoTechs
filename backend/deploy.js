// Simple deployment script for Azure App Service
// This ensures the app starts correctly without complex build processes

const fs = require('fs');
const path = require('path');

console.log('🚀 LemoTech Backend Deployment Script');
console.log('📁 Working directory:', process.cwd());
console.log('📦 Node version:', process.version);

// Check if we're in the backend directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('📋 Project:', packageJson.name);
  console.log('🔢 Version:', packageJson.version);
}

// Check if dist directory exists
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log('✅ Built files found in dist/');
} else {
  console.log('⚠️ No dist/ directory found - running build...');
  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

console.log('🎯 Deployment preparation complete!');
console.log('🌐 Starting application...');
