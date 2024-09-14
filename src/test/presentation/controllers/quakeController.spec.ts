import { Test, TestingModule } from '@nestjs/testing';

import { HttpService } from '@nestjs/axios';
import {
  IssueCorrect,
  IssueType,
} from 'src/domain/enum/quakeHistrory/issueEnum';
import {
  EarthquakeDomesticTsunami,
  EarthquakeForeignTsunami,
} from 'src/domain/enum/quakeHistrory/earthquakeEnum';
import { PointsScale } from 'src/domain/enum/quakeHistrory/pointsEnum';

import { QuakeService } from 'src/application/services/quakeService';
import { QuakeController } from 'src/presentation/controllers/quakeController';
import {
  fetchQuakeHistoryInfoResponseDto,
  fetchQuakeHistoryInfoRequestDto,
} from 'src/application/dto/quakeHistoryInfoDto';

jest.mock('src/application/services/quakeService');

describe('QuakeController', () => {
  let quakeController: QuakeController;
  let quakeService: QuakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuakeController],
      providers: [
        QuakeService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    quakeController = module.get<QuakeController>(QuakeController);
    quakeService = module.get<QuakeService>(QuakeService);
  });

  describe('fetchQuakeHistoryInfo', () => {
    it('should return earthquake history data', async () => {
      // モックデータ
      const mockResponse: fetchQuakeHistoryInfoResponseDto[] = [
        {
          id: '1',
          code: 551,
          time: '2024-01-01T00:00:00.000Z',
          issue: {
            source: 'source',
            time: '2024-01-01T00:00:00.000Z',
            type: IssueType.DETAILSCALE,
            correct: IssueCorrect.DESTINATIONONLY,
          },
          earthquake: {
            time: '2024-01-01T00:00:00.000Z',
            hypocenter: {
              name: 'Tokyo',
              latitude: 35.0,
              longitude: 139.0,
              depth: 10,
              magnitude: 5.5,
            },
            maxScale: 7,
            domesticTsunami: EarthquakeDomesticTsunami.CHECKING,
            foreignTsunami: EarthquakeForeignTsunami.CHECKING,
          },
          points: [
            {
              pref: 'Tokyo',
              addr: 'Shibuya',
              isArea: true,
              scale: PointsScale.SCALE10,
            },
          ],
          comments: {
            freeFormComment: 'No additional information.',
          },
        },
      ];

      // QuakeServiceのfetchQuakeHistoryInfoメソッドをモック化
      jest
        .spyOn(quakeService, 'fetchQuakeHistoryInfo')
        .mockResolvedValue(mockResponse);

      // リクエストDTO
      const request: fetchQuakeHistoryInfoRequestDto = {
        limit: 1,
        offset: 0,
      };

      // コントローラの呼び出し
      const result = await quakeController.fetchQuakeHistoryInfo(request);

      // 結果の検証
      expect(result).toEqual(mockResponse);
      expect(quakeService.fetchQuakeHistoryInfo).toHaveBeenCalledWith(1, 0);
    });
  });
});
