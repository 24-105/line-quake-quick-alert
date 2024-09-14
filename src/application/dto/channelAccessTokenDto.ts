import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// LINEチャンネルアクセストークンレスポンスDTO
export class fetchChannelAccessTokenResponseDto {
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  token_type: string;

  @IsNotEmpty()
  @IsNumber()
  expires_in: number;

  @IsNotEmpty()
  @IsString()
  key_id: string;
}
