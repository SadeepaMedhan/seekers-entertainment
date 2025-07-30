#!/usr/bin/env node

/**
 * Post-build script for Vercel deployment
 * This script runs after the build process to handle any post-deployment tasks
 */

const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Running post-build tasks...');

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

if (isProduction && isVercel) {
  console.log('📋 Production deployment detected on Vercel');
  
  // Log environment variables (without values for security)
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  console.log('🔍 Checking required environment variables...');
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
  } else {
    console.log('✅ All required environment variables are set');
  }
  
  // Note: Auto-seeding will be handled by the middleware on first request
  console.log('💡 Database seeding will be handled automatically on first request');
} else {
  console.log('🏠 Development environment - skipping production tasks');
}

console.log('✅ Post-build tasks completed');
