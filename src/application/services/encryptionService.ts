import { Injectable } from '@nestjs/common';
import { IEncryptionService } from 'src/domain/interfaces/services/encryptionService';
import { decrypt, encrypt } from 'src/domain/useCase/encryption';

/**
 * Encryption service
 */
@Injectable()
export class EncryptionService implements IEncryptionService {
  private readonly key = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');

  /**
   * Encrypt text.
   * @param text text to encrypt
   * @returns encrypted text
   */
  async encrypt(text: string): Promise<string> {
    return encrypt(text, this.key);
  }

  /**
   * Decrypt text.
   * @param text text to decrypt
   * @returns decrypted text
   */
  async decrypt(text: string): Promise<string> {
    return decrypt(text, this.key);
  }
}
