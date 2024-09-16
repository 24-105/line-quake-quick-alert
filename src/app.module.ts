import { Module } from '@nestjs/common';
import { QuakeModule } from './modules/quakeModule';
import { LineModule } from './modules/lineModule';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './modules/adminModule';

/**
 * アプリケーションモジュール
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`, // 環境に応じたファイルを読み込む
      isGlobal: true, // グローバルに設定する
    }),
    ScheduleModule.forRoot(), // スケジュールモジュールを追加
    AdminModule,
    QuakeModule,
    LineModule,
  ],
})
export class AppModule {}
