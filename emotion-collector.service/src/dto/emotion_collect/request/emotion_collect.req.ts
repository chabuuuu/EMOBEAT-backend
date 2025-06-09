import { EventEmotionCollectEnum } from '@/enums/event-emotion-collect.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class EmotionCollectReq {
  @IsNotEmpty()
  userId!: number;
  @IsOptional()
  musicId?: number;
  @IsNotEmpty()
  emotion!: number;
  @IsNotEmpty()
  event!: EventEmotionCollectEnum;
  @IsOptional()
  play_percentage?: number;
}
