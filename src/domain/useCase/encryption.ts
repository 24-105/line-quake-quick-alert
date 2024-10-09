import * as crypto from 'crypto';
import { ENCRYPTION_ALGORITHM } from 'src/config/constants';

/**
 * Encrypt text.
 * @param text text to encrypt
 * @param key encryption key
 * @returns encrypted text
 */
export const encrypt = (text: string, key: Buffer, iv: Buffer): string => {
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
};

/**
 * Decrypt text.
 * @param text text to decrypt
 * @param key encryption key
 * @returns decrypted text
 */
export const decrypt = (text: string, key: Buffer): string => {
  const [ivHex, encryptedText, authTagHex] = text.split(':');
  const ivBuffer = Buffer.from(ivHex, 'hex');
  const authTagBuffer = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
