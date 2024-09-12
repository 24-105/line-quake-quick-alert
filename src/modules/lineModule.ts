import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LineAuthController } from 'src/presentation/controllers/lineAuthController';
import { AccessTokenService } from 'src/application/services/accessTokenService';
import { LineApiService } from 'src/infrastructure/api/line/lineApiService';

@Module({
  imports: [HttpModule],
  controllers: [LineAuthController],
  providers: [AccessTokenService, LineApiService],
})
export class LineModule {}
