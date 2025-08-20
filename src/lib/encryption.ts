import CryptoJS from 'crypto-js';
import { env } from '~/env';

// Encryption key should be stored in environment variables
const ENCRYPTION_KEY =
  env.ENCRYPTION_KEY || 'fallback-key-change-in-production';

/**
 * Encrypts a string value using AES encryption
 * @param value - The string to encrypt
 * @returns The encrypted string
 */
export function encrypt(value: string): string {
  if (!value) return '';

  try {
    return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt value');
  }
}

/**
 * Decrypts an encrypted string value
 * @param encryptedValue - The encrypted string to decrypt
 * @returns The decrypted string
 */
export function decrypt(encryptedValue: string): string {
  if (!encryptedValue) return '';

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt value');
  }
}

/**
 * Safely decrypts a value, returning empty string if decryption fails
 * @param encryptedValue - The encrypted string to decrypt
 * @returns The decrypted string or empty string if decryption fails
 */
export function safeDecrypt(encryptedValue: string | null): string {
  if (!encryptedValue) return '';

  try {
    return decrypt(encryptedValue);
  } catch (error) {
    console.error('Safe decryption failed:', error);
    return '';
  }
}
