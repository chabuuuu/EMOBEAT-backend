import { IsNotEmpty } from 'class-validator';

export class ContributorExchangePremiumReq {
  @IsNotEmpty()
  listenerUsername!: string;

  @IsNotEmpty()
  pointsExchange!: number;
}
