/**
 * LINE Message API interface
 */
export interface IMessageApi {
  pushMessage(
    channelAccessToken: string,
    to: string,
    messages: { type: string; text: string }[],
  ): Promise<void>;
}
