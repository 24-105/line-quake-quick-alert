import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuakeService } from './application/services/quakeService';
import { QuakeController } from './presentation/controllers/quakeController';
import { P2pQuakeApiService } from './infrastructure/api/p2pQuake/p2pQuakeApiService';

@Module({
  imports: [HttpModule],
  controllers: [QuakeController],
  providers: [QuakeService, P2pQuakeApiService],
})
export class AppModule {}
