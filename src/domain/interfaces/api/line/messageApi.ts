/**
 * LINE Message API interface
 */
export interface IMessageApi {
  pushMessage(
    channelAccessToken: string,
    to: string,
    messages: string[],
  ): Promise<void>;
}
