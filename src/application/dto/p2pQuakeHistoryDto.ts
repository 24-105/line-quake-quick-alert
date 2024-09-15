import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

import {
  EarthquakeDomesticTsunami,
  EarthquakeForeignTsunami,
} from 'src/domain/enum/quakeHistrory/earthquakeEnum';
import {
  IssueType,
  IssueCorrect,
} from 'src/domain/enum/quakeHistrory/issueEnum';
import { PointsScale } from 'src/domain/enum/quakeHistrory/pointsEnum';

// 地震情報取得リクエスト
export class fetchQuakeHistoryRequestDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  codes: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number;
}

// 地震情報概要
class QuakeHistoryIssue {
  @IsString()
  source?: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsString()
  type: IssueType;

  @IsString()
  correct?: IssueCorrect;
}

// 震源地
class QuakeHistoryHypocenter {
  @IsString()
  name?: string;

  @IsNumber()
  latitude?: number;

  @IsNumber()
  longitude?: number;

  @IsNumber()
  depth?: number;

  @IsNumber()
  magnitude?: number;
}

// 地震情報詳細
class QuakeHistoryEarthquake {
  @IsNotEmpty()
  @IsString()
  time: string;

  hypocenter?: QuakeHistoryHypocenter;

  @IsNumber()
  maxScale?: number;

  @IsString()
  domesticTsunami?: EarthquakeDomesticTsunami;

  @IsString()
  foreignTsunami?: EarthquakeForeignTsunami;
}

// 震度観測点の情報
class QuakeHistoryPoints {
  @IsNotEmpty()
  @IsString()
  pref: string;

  @IsNotEmpty()
  @IsString()
  addr: string;

  @IsNotEmpty()
  @IsBoolean()
  isArea: boolean;

  @IsNotEmpty()
  @IsNumber()
  scale: PointsScale;
}

// 付加文
class QuakeHistoryComments {
  @IsNotEmpty()
  @IsString()
  freeFormComment: string;
}

// P2P地震情報レスポンスDTO
export class fetchP2pQuakeHistoryResponseDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  code: number;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  issue: QuakeHistoryIssue;

  @IsNotEmpty()
  earthquake: QuakeHistoryEarthquake;

  points?: QuakeHistoryPoints[];

  @IsNotEmpty()
  comments: QuakeHistoryComments;
}

// P2P地震情報リクエストDTO
export class FetchP2pQuakeHistoryRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  codes: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  offset: number;
}
