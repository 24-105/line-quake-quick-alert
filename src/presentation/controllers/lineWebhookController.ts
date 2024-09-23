import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LineWebhookService } from 'src/application/services/lineWebhookService';

// Log message constants
const LOG_MESSAGES = {
  HANDLING_WEBHOOK_EVENTS_FAILED: 'Failed to handling webhook events.',
};

/**
 * LINE webhook controller
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
    if (!(await this.lineWebhookService.isValidWebhookRequest(body))) {
      res.status(400).send('Bad Request');
      return;
    }

    // Returns status code 200 immediately.
    res.status(200).send('OK');

    try {
      // Handle webhook events.
      await this.lineWebhookService.handleEvents(body.events);
    } catch (err) {
      this.logger.error(LOG_MESSAGES.HANDLING_WEBHOOK_EVENTS_FAILED, err.stack);
    }
  }
}
