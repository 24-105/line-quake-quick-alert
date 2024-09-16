import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LineAuthController } from 'src/presentation/controllers/lineAuthController';
import { LineMessagingApiService } from 'src/infrastructure/api/line/lineMessagingApiService';
import { LineWebhookController } from 'src/presentation/controllers/lineWebhookController';
import { ChannelAccessTokenService } from 'src/application/services/channelAccessTokenService';
import { ChannelAccessTokenBatchService } from 'src/application/services/channelAccessTokenBatchService';
import { ChannelAccessTokenRepository } from 'src/infrastructure/persistence/repositories/channelAccessTokenRepository';

/**
 * LINEモジュール
 */
@Module({
  imports: [HttpModule],
  controllers: [LineAuthController, LineWebhookController],
  providers: [
    ChannelAccessTokenService,
    ChannelAccessTokenBatchService,
    LineMessagingApiService,
    ChannelAccessTokenRepository,
  ],
})
export class LineModule {}
