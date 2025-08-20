#!/usr/bin/env node

/**
 * Script to generate a secure encryption key for token encryption
 * Run this script to generate a secure 32+ character encryption key
 */

import crypto from 'crypto';

// Generate a secure random key (64 characters for extra security)
const encryptionKey = crypto.randomBytes(32).toString('hex');

console.log('🔐 Generated secure encryption key:');
console.log('');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log('');
console.log('📝 Add this to your .env file:');
console.log('');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log('');
console.log('⚠️  Important security notes:');
console.log('• Keep this key secret and never commit it to version control');
console.log('• Use different keys for development, staging, and production');
console.log('• Store this key securely in your deployment environment');
console.log(
  '• If you change this key, existing encrypted tokens will need to be re-encrypted',
);
