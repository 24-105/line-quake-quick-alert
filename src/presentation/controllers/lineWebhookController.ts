import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * LINE Webhookコントローラー
 */
@Controller('webhook')
export class LineWebhookController {
  /**
   * Webhookの処理
   * @param req
   * @param res
   */
  @Post()
  handleWebhook(@Req() req: Request, @Res() res: Response): void {
    // リクエストの処理
    console.log(req.body);

    // ステータスコード200を返す
    res.status(200).send('OK');
  }
}
