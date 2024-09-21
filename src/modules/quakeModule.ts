import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuakeService } from 'src/application/services/quakeService';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { QuakeController } from 'src/presentation/controllers/quakeController';
import { QuakeHistoryRepository } from 'src/infrastructure/persistence/repositories/quakeHistoryRepository';
import { QuakeBatchService } from 'src/application/services/quakeBatchService';

/**
 * Quake module
 */
@Module({
  imports: [HttpModule],
  controllers: [QuakeController],
  providers: [
    QuakeService,
    QuakeBatchService,
    P2pQuakeApiService,
    QuakeHistoryRepository,
  ],
})
export class QuakeModule {}
