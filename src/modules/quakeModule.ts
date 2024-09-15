import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuakeService } from 'src/application/services/quakeService';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { QuakeController } from 'src/presentation/controllers/quakeController';
import { DynamodbRepository } from 'src/infrastructure/presistance/repositories/dynamodbRepository';

/**
 * 地震モジュール
 */
@Module({
  imports: [HttpModule],
  controllers: [QuakeController],
  providers: [QuakeService, P2pQuakeApiService, DynamodbRepository],
})
export class QuakeModule {}
