/**
 * Encryption service interface
 */
export interface IEncryptionService {
  encrypt(text: string): Promise<string>;
  decrypt(text: string): Promise<string>;
}
