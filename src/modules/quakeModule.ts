import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuakeService } from 'src/application/services/quakeService';
import { P2pQuakeApi } from 'src/infrastructure/api/p2pQuake/p2pQuakeApi';
import { QuakeHistoryRepository } from 'src/infrastructure/repositories/quakeHistoryRepository';
import { QuakeBatchService } from 'src/application/services/quakeBatchService';

/**
 * Quake module
 */
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    QuakeService,
    QuakeBatchService,
    P2pQuakeApi,
    QuakeHistoryRepository,
  ],
})
export class QuakeModule {}
