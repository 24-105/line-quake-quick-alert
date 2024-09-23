import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LineWebhookService } from 'src/application/services/lineWebhookService';

/**
 * LINE Webhook controller
 */
@Controller('webhook')
export class LineWebhookController {
  private readonly logger = new Logger(LineWebhookController.name);

  constructor(private readonly lineWebhookService: LineWebhookService) {}

  /**
   * Handling LINE webhook event.
   * @param req request
   * @param res response
   */
  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const body = req.body;

    // Check if the request body is valid.
    if (this.lineWebhookService.isValidWebhookRequest(body)) {
      // Returns status code 200 immediately.
      res.status(200).send('OK');

      // Process the webhook events.
      await this.lineWebhookService.processEvent(body.events);
    } else {
      res.status(400).send('Bad Request');
    }
  }
}
