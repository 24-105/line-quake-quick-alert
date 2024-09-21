import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * LINE Webhook Controller
 */
@Controller('webhook')
export class LineWebhookController {
  /**
   * Handling webhooks.
   * @param req request
   * @param res response
   */
  @Post()
  handleWebhook(@Req() req: Request, @Res() res: Response): void {
    console.log(req.body);

    // Returns status code 200
    res.status(200).send('OK');
  }
}
