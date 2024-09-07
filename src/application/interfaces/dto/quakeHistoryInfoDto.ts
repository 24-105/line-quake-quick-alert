import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from '@nestjs/class-validator';
import { IssueCorrect, IssueType } from '../enum/quakeHistrory/issueEnum';
import {
  EarthquakeDomesticTsunami,
  EarthquakeForeignTsunami,
} from '../enum/quakeHistrory/earthquakeEnum';
import { PointsScale } from '../enum/quakeHistrory/pointsEnum';
import { Type } from 'class-transformer';

// 地震情報取得APIリクエスト
export class getQuakeHistoryInfoRequestDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}

// 地震情報概要
class QuakeHistoryInfoIssue {
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

// 地震情報取得APIレスポンス
export class getQuakeHistoryInfoResponseDto {
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
  issue: QuakeHistoryInfoIssue;

  @IsNotEmpty()
  earthquake: QuakeHistoryEarthquake;

  points?: QuakeHistoryPoints[];

  @IsNotEmpty()
  comments: QuakeHistoryComments;
}
