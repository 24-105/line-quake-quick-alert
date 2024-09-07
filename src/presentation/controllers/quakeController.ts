import {
  Controller,
  Get,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuakeService } from '../../application/services/quakeService';
import {
  getQuakeHistoryInfoRequestDto,
  getQuakeHistoryInfoResponseDto,
} from 'src/application/interfaces/dto/quakeHistoryInfoDto';

/**
 * 地震情報コントローラー
 */
@Controller('api/v1/quake')
export class QuakeController {
  private readonly logger = new Logger(QuakeController.name);

  constructor(private readonly quakeService: QuakeService) {}

  /**
   * 地震情報を取得する
   * @returns getQuakeHistoryInfoDto
   */
  @Get('history')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getQuakeHistoryInfo(
    @Query() request: getQuakeHistoryInfoRequestDto,
  ): Promise<getQuakeHistoryInfoResponseDto> {
    const { limit, offset } = request;
    this.logger.log(`limit: ${limit}`);
    this.logger.log(`offset: ${offset}`);
    const response = await this.quakeService.fetchQuake(limit, offset);
    return response.data;
  }
}
