import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 疎通確認コントローラー
 */
@Controller('/')
export class HealthCheckController {
  /**
   * 疎通確認
   * @param req
   * @param res
   */
  @Get()
  handleWebhook(@Req() req: Request, @Res() res: Response): void {
    // リクエストの処理
    console.log(req.body);

    // ステータスコード200を返す
    res.status(200).send('Quake Alert backend application is running');
  }
}
