import { WebhookEvent } from '@line/bot-sdk';
import { IFollowEventService } from 'src/domain/interfaces/services/followEventService';
import { UserService } from './userService';
import { Logger } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';

// Log message constants
const LOG_MESSAGES = {
  HANDLING_FOLLOW_EVENT: 'Handling follow event.',
  HANDLING_FOLLOW_EVENT_FAILED: 'Handling follow event failed.',
  HANDLING_UNFOLLOW_EVENT: 'Handling unfollow event.',
  HANDLING_UNFOLLOW_EVENT_FAILED: 'Handling unfollow event failed.',
};

/**
 * Follow event service
 */
export class FollowEventService implements IFollowEventService {
  private readonly logger = new Logger(FollowEventService.name);

  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Handle follow event.
   * @param event event object
   */
  async handleFollowEvent(event: WebhookEvent): Promise<void> {
    this.logger.log(LOG_MESSAGES.HANDLING_FOLLOW_EVENT);
    try {
      await this.userService.ensureUserIdExists(event.source.userId);
    } catch (err) {
      this.logger.log(LOG_MESSAGES.HANDLING_FOLLOW_EVENT_FAILED);
      throw err;
    }
  }

  /**
   * Handle unfollow event.
   * @param event event object
   */
  async handleUnfollowEvent(event: WebhookEvent): Promise<void> {
    this.logger.log(LOG_MESSAGES.HANDLING_UNFOLLOW_EVENT);
    try {
      await this.userRepository.deleteUser(event.source.userId);
    } catch (err) {
      this.logger.log(LOG_MESSAGES.HANDLING_UNFOLLOW_EVENT_FAILED);
      throw err;
    }
  }
}
