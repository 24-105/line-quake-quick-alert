import { TextMessage, WebhookEvent, MessageEvent } from '@line/bot-sdk';

/**
 * Type guard to check if the event is a MessageEvent
 * @param event WebhookEvent
 * @returns true: MessageEvent, false: not MessageEvent
 */
export const isMessageEvent = (event: WebhookEvent): event is MessageEvent => {
  return event.type === 'message';
};

/**
 * Type guard to check if the message is a TextMessage
 * @param message any
 * @returns true: TextMessage, false: not TextMessage
 */
export const isTextMessage = (message: any): message is TextMessage => {
  return message.type === 'text';
};
