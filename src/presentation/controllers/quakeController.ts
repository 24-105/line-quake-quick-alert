import {
  Controller,
  Get,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  fetchQuakeHistoryRequestDto,
  fetchQuakeHistoryResponse,
} from 'src/application/dto/quakeHistoryDto';

import { QuakeService } from 'src/application/services/quakeService';

/**
 * 地震情報コントローラー
 */
@Controller('api/v1/quake')
export class QuakeController {
  private readonly logger = new Logger(QuakeController.name);
  private readonly REQUEST_FETCH_QUAKE_HISTORY_LOG =
    'Requesting fetch quake history';
  private readonly REQUEST_SUCCESS_LOG = 'Quake history successfully fetched';
  private readonly REQUEST_ERROR_LOG = 'Failed to fetch quake history';

  constructor(private readonly quakeService: QuakeService) {}

  /**
   * 地震情報を取得する
   * @param request リクエストパラメーター
   * @returns 地震情報DTO
   */
  @Get('history')
  @UsePipes(new ValidationPipe({ transform: true }))
  async fetchQuakeHistory(
    @Query() request: fetchQuakeHistoryRequestDto,
  ): Promise<fetchQuakeHistoryResponse[]> {
    this.logger.log(this.REQUEST_FETCH_QUAKE_HISTORY_LOG);

    const { codes, limit, offset } = request;

    try {
      this.logger.log(
        `Fetching quake history called with limit: ${limit}, offset: ${offset}, codes: ${codes}`,
      );
      const response = await this.quakeService.fetchQuakeHistory(
        codes,
        limit,
        offset,
      );
      this.logger.log(this.REQUEST_SUCCESS_LOG);
      return response;
    } catch (err) {
      this.logger.error(this.REQUEST_ERROR_LOG, err.stack);
      throw err;
    }
  }
}
