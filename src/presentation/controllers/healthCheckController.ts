import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

// Log message constants
const LOG_MESSAGES = {
  APP_RUNNING: 'Quake Alert backend application is running.',
};

/**
 * HealthCheck controller
 */
@Controller('/health')
export class HealthCheckController {
  /**
   * Handling backend application health check.
   * @param res response
   */
  @Get()
  handleWebhook(@Res() res: Response): void {
    // Returns status code 200.
    res.status(200).send(LOG_MESSAGES.APP_RUNNING);
  }
}
