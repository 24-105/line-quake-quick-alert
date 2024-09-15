import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LineAuthController } from 'src/presentation/controllers/lineAuthController';
import { AccessTokenService } from 'src/application/services/accessTokenService';
import { LineMessagingApiService } from 'src/infrastructure/api/line/lineMessagingApiService';

/**
 * LINEモジュール
 */
@Module({
  imports: [HttpModule],
  controllers: [LineAuthController],
  providers: [AccessTokenService, LineMessagingApiService],
})
export class LineModule {}
