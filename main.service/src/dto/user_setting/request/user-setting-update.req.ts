import { IsOptional } from 'class-validator';

export class UserSettingUpdateReq {
  @IsOptional()
  isAllowRecommend?: boolean;

  @IsOptional()
  recommendInterval?: number;

  @IsOptional()
  detectInterval?: number;
}
