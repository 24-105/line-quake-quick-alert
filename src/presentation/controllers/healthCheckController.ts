import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

/**
 * HealthCheck controller
 */
@Controller('/')
export class HealthCheckController {
  /**
   * Handling backend application health check.
   * @param res response
   */
  @Get()
  handleWebhook(@Res() res: Response): void {
    // Returns status code 200.
    res.status(200).send('Quake Alert backend application is running.');
  }
}
