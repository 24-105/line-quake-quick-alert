import { Module } from '@nestjs/common';
import { UserService } from 'src/application/services/userService';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { EncryptModule } from './encryptionModule';

/**
 * User module
 */
@Module({
  imports: [EncryptModule],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
