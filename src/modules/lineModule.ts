import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LineWebhookController } from 'src/presentation/controllers/lineWebhookController';
import { ChannelAccessTokenService } from 'src/application/services/channelAccessTokenService';
import { ChannelAccessTokenBatchService } from 'src/application/services/channelAccessTokenBatchService';
import { ChannelAccessTokenRepository } from 'src/infrastructure/repositories/channelAccessTokenRepository';
import { LineWebhookService } from 'src/application/services/lineWebhookService';
import { ChannelAccessTokenApi } from 'src/infrastructure/api/line/channelAccessTokenApi';
import { MessageEventService } from 'src/application/services/messageEventService';
import { UserApi } from 'src/infrastructure/api/line/userApi';
import { MessageApi } from 'src/infrastructure/api/line/messageApi';
import { FollowEventService } from 'src/application/services/followEventService';
import { UserModule } from './userModule';

/**
 * LINE module
 */
@Module({
  imports: [HttpModule, UserModule],
  controllers: [LineWebhookController],
  providers: [
    ChannelAccessTokenService,
    ChannelAccessTokenBatchService,
    LineWebhookService,
    MessageEventService,
    FollowEventService,
    UserApi,
    MessageApi,
    ChannelAccessTokenApi,
    ChannelAccessTokenRepository,
  ],
})
export class LineModule {}
