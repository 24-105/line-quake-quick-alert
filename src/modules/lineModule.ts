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
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { UserService } from 'src/application/services/userService';

/**
 * LINE module
 */
@Module({
  imports: [HttpModule],
  controllers: [LineWebhookController],
  providers: [
    ChannelAccessTokenService,
    ChannelAccessTokenBatchService,
    LineWebhookService,
    MessageEventService,
    UserService,
    UserApi,
    MessageApi,
    ChannelAccessTokenApi,
    UserRepository,
    ChannelAccessTokenRepository,
  ],
})
export class LineModule {}
