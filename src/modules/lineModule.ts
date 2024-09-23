import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LineAuthController } from 'src/presentation/controllers/lineAuthController';
import { LineWebhookController } from 'src/presentation/controllers/lineWebhookController';
import { ChannelAccessTokenService } from 'src/application/services/channelAccessTokenService';
import { ChannelAccessTokenBatchService } from 'src/application/services/channelAccessTokenBatchService';
import { ChannelAccessTokenRepository } from 'src/infrastructure/persistence/repositories/channelAccessTokenRepository';
import { LineWebhookService } from 'src/application/services/lineWebhookService';
import { ChannelAccessTokenApi } from 'src/infrastructure/api/line/channelAccessTokenApi';
import { MessageEventService } from 'src/application/services/messageEventService';
import { UserApi } from 'src/infrastructure/api/line/userApi';
import { MessageApi } from 'src/infrastructure/api/line/messageApi';

/**
 * LINE module
 */
@Module({
  imports: [HttpModule],
  controllers: [LineAuthController, LineWebhookController],
  providers: [
    ChannelAccessTokenService,
    ChannelAccessTokenBatchService,
    LineWebhookService,
    MessageEventService,
    UserApi,
    MessageApi,
    ChannelAccessTokenApi,
    ChannelAccessTokenRepository,
  ],
})
export class LineModule {}
