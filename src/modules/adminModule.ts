import { Module } from '@nestjs/common';
import { HealthCheckController } from 'src/presentation/controllers/healthCheckController';

/**
 * 管理者モジュール
 */
@Module({
  controllers: [HealthCheckController],
})
export class AdminModule {}
