import { Module } from '@nestjs/common';
import { QuakeModule } from './modules/quakeModule';
import { LineModule } from './modules/lineModule';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './modules/adminModule';
import { AppDataSource } from './config/dataSource';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Application module
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options), // Added TypeORM settings.
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`, // Load files according to the environment.
      isGlobal: true, // Set globally.
    }),
    ScheduleModule.forRoot(), // Add schedule module.
    AdminModule,
    QuakeModule,
    LineModule,
  ],
})
export class AppModule {}
