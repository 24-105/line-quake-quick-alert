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
  fetchP2pQuakeHistoryResponseDto,
} from 'src/application/dto/quakeHistoryDto';
import { QuakeService } from 'src/application/services/quakeService';

// Log message constants
const REQUEST_FETCH_QUAKE_HISTORY_LOG = 'Requesting fetch quake history.';
const REQUEST_FETCH_QUAKE_HISTORY_SUCCESS_LOG =
  'Quake history successfully fetched.';
const REQUEST_FETCH_QUAKE_HISTORY_FAILED_LOG = 'Failed to fetch quake history.';

/**
 * Quake controller
 */
@Controller('api/v1/quake')
export class QuakeController {
  private readonly logger = new Logger(QuakeController.name);

  constructor(private readonly quakeService: QuakeService) {}

  /**
   * Fetch quake history.
   * @param request request parameters
   * @returns quake history DTO
   */
  @Get('history')
  @UsePipes(new ValidationPipe({ transform: true }))
  async fetchQuakeHistory(
    @Query() request: fetchQuakeHistoryRequestDto,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]> {
    this.logger.log(REQUEST_FETCH_QUAKE_HISTORY_LOG);

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
      this.logger.log(REQUEST_FETCH_QUAKE_HISTORY_SUCCESS_LOG);
      return response;
    } catch (err) {
      this.logger.error(REQUEST_FETCH_QUAKE_HISTORY_FAILED_LOG, err.stack);
      throw err;
    }
  }
}
