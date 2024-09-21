import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HealthCheck Controller
 */
@Controller('/')
export class HealthCheckController {
  /**
   * Executes health check.
   * @param req request
   * @param res response
   */
  @Get()
  handleWebhook(@Req() req: Request, @Res() res: Response): void {
    console.log(req.body);

    // Returns status code 200.
    res.status(200).send('Quake Alert backend application is running.');
  }
}
