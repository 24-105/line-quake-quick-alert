import { Test, TestingModule } from '@nestjs/testing';
import { QuakeController } from '../src/presentation/controllers/quakeController';
import { QuakeService } from '../src/application/services/quakeService';

describe('QuakeController', () => {
  let quakeController: QuakeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QuakeController],
      providers: [QuakeService],
    }).compile();

    quakeController = app.get<QuakeController>(QuakeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const request = {
        limit: 1,
        offset: 0,
      };
      expect(quakeController.getQuakeHistoryInfo(request)).toBe('Hello World!');
    });
  });
});
