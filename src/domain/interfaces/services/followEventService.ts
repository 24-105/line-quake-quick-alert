import { WebhookEvent } from '@line/bot-sdk';

/**
 * Follow event service interface
 */
export interface IFollowEventService {
  handleFollowEvent(event: WebhookEvent): Promise<void>;
  handleUnfollowEvent(event: WebhookEvent): Promise<void>;
}
