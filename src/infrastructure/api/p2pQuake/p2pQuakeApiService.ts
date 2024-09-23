import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  FetchP2pQuakeHistoryRequestDto,
  fetchP2pQuakeHistoryResponseDto,
} from 'src/application/dto/quakeHistoryDto';
import { IP2pQuakeApiService } from 'src/domain/interfaces/api/p2pQuakeApiService';
import { P2P_GET_QUAKE_HISTORY_URL } from 'src/config/constants';

// Log message constants
const REQUEST_QUAKE_HISTORY_LOG =
  'Fetching quake history from the P2P Quake API.';
const REQUEST_FETCH_QUAKE_HISTORY_FAILED_LOG = 'Failed to fetch quake history.';

/**
 * P2P地震情報 API service
 */
@Injectable()
export class P2pQuakeApiService implements IP2pQuakeApiService {
  private readonly logger = new Logger(P2pQuakeApiService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetch quake history from P2P 地震情報 API.
   * https://www.p2pquake.net/develop/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history
   * @param codes quake history code
   * @param limit Number of returned items
   * @param offset Number of items to skip
   * @returns P2P地震情報 API quake history response Dto
   */
  async fetchP2pQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]> {
    // create request parameters.
    const params = this.createParams(codes, limit, offset);

    // Fetch quake history from P2P地震情報 API.
    try {
      this.logger.log(REQUEST_QUAKE_HISTORY_LOG);
      const response = await firstValueFrom(
        this.httpService.get(P2P_GET_QUAKE_HISTORY_URL, { params }),
      );
      return response.data;
    } catch (err) {
      this.logger.error(`${REQUEST_FETCH_QUAKE_HISTORY_FAILED_LOG}`, err.stack);
      throw err;
    }
  }

  /**
   * Create HTTP request parameters.
   * @param codes quake history code
   * @param limit Number of returned items
   * @param offset Number of items to skip
   * @returns P2P地震情報 API quake history request Dto
   */
  private createParams(
    codes: number,
    limit: number,
    offset: number,
  ): FetchP2pQuakeHistoryRequestDto {
    return {
      codes: codes,
      limit: limit,
      offset: offset,
    };
  }
}
