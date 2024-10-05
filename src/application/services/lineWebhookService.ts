import * as crypto from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { WebhookEvent } from '@line/bot-sdk';
import { ILineWebhookService } from 'src/domain/interfaces/services/lineWebhookService';
import { MessageEventService } from './messageEventService';
import { FollowEventService } from './followEventService';

// Log message constants
const LOG_MESSAGES = {
  EVENT_TYPE_NOT_SUPPORTED: 'Event types not supported.',
};

/**
 * LINE webhook service
 */
@Injectable()
export class LineWebhookService implements ILineWebhookService {
  private readonly logger = new Logger(LineWebhookService.name);

  constructor(
    private readonly messageEventService: MessageEventService,
    private readonly followEventService: FollowEventService,
  ) {}

  /**
   * Verify the signature.
   * @param body request body
   * @param signature signature
   * @returns true: valid signature, false: invalid signature
   */
  verifySignature(body: any, signature: string): boolean {
    const channelSecret = process.env.LINE_QUALE_QUICK_ALERT_SECRET;
    const hash = crypto
      .createHmac('SHA256', channelSecret)
      .update(JSON.stringify(body))
      .digest('base64');
    return hash === signature;
  }

  /**
   * Handle webhook events.
   * @param events array of webhook events
   */
  handleEvents(events: WebhookEvent[]): void {
    for (const event of events) {
      this.handleEvent(event);
    }
  }

  /**
   * Handle a single webhook event.
   * @param event webhook event
   */
  private handleEvent(event: WebhookEvent): void {
    switch (event.type) {
      case 'message':
        this.messageEventService.handleMessageEvent(event);
        break;
      case 'follow':
        this.followEventService.handleFollowEvent(event);
        break;
      case 'unfollow':
        this.followEventService.handleUnfollowEvent(event);
        break;
      default:
        this.logger.warn(LOG_MESSAGES.EVENT_TYPE_NOT_SUPPORTED, event.type);
    }
  }
}
