import { Module } from '@nestjs/common';
import { QuakeController } from './presentation/controllers/quakeController';
import { QuakeService } from './application/services/quakeService';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [QuakeController],
  providers: [QuakeService],
})
export class AppModule {}
