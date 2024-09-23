import {
  Controller,
  Get,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { processQuakeHistoryRequestDto as processQuakeHistoryRequestDto } from 'src/application/dto/quakeHistoryDto';
import { QuakeService } from 'src/application/services/quakeService';

// Log message constants
const LOG_MESSAGES = {
  REQUEST_PROCESS_QUAKE_HISTORY: 'Requesting process quake history.',
  REQUEST_PROCESS_QUAKE_HISTORY_SUCCESS:
    'Quake history successfully processed.',
  REQUEST_PROCESS_QUAKE_HISTORY_FAILED: 'Failed to process quake history.',
};

/**
 * Quake controller
 */
@Controller('api/v1/quake')
export class QuakeController {
  private readonly logger = new Logger(QuakeController.name);

  constructor(private readonly quakeService: QuakeService) {}

  /**
   * Process quake history.
   * @param request request parameters
   */
  @Get('history')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processQuakeHistory(
    @Query() request: processQuakeHistoryRequestDto,
  ): Promise<void> {
    this.logger.log(LOG_MESSAGES.REQUEST_PROCESS_QUAKE_HISTORY);

    const { codes, limit, offset } = request;

    try {
      await this.quakeService.processQuakeHistory(codes, limit, offset);
      this.logger.log(LOG_MESSAGES.REQUEST_PROCESS_QUAKE_HISTORY_SUCCESS);
    } catch (err) {
      this.logger.error(
        LOG_MESSAGES.REQUEST_PROCESS_QUAKE_HISTORY_FAILED,
        err.stack,
      );
      throw err;
    }
  }
}
