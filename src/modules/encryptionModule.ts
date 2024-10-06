import { Module } from '@nestjs/common';
import { EncryptionService } from 'src/application/services/encryptionService';

/**
 * Encrypt module
 */
@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptModule {}
