import { Module } from '@nestjs/common';
import { QuakeModule } from './modules/quakeModule';
import { LineModule } from './modules/lineModule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // グローバルに設定する
    }),
    QuakeModule,
    LineModule,
  ],
})
export class AppModule {}
