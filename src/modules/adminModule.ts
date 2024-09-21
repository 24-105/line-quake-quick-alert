import { Module } from '@nestjs/common';
import { HealthCheckController } from 'src/presentation/controllers/healthCheckController';

/**
 * Admin module
 */
@Module({
  controllers: [HealthCheckController],
})
export class AdminModule {}
