import {
  Controller,
  Get,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  getQuakeHistoryInfoRequestDto,
  getQuakeHistoryInfoResponseDto,
} from 'src/application/interfaces/dto/quakeHistoryInfoDto';
import { QuakeService } from 'src/application/services/quakeService';

/**
 * 地震情報コントローラー
 */
@Controller('api/v1/quake')
export class QuakeController {
  private readonly logger = new Logger(QuakeController.name);

  constructor(private readonly quakeService: QuakeService) {}

  /**
   * 地震情報を取得する
   * @param request リクエストパラメーター
   * @returns 地震情報DTO
   */
  @Get('history')
  @UsePipes(new ValidationPipe({ transform: true }))
  async fetchQuakeHistoryInfo(
    @Query() request: getQuakeHistoryInfoRequestDto,
  ): Promise<getQuakeHistoryInfoResponseDto[]> {
    const { limit, offset } = request;

    this.logger.log(
      `fetchQuakeHistoryInfo called with limit: ${limit}, offset: ${offset}`,
    );

    try {
      const response = await this.quakeService.fetchQuakeHistoryInfo(
        limit,
        offset,
      );
      this.logger.log('Quake history successfully fetched');
      return response;
    } catch (err) {
      this.logger.error('Failed to fetch quake history', err.stack);
      throw err;
    }
  }
}
