import { ContributorRegisterReq } from '@/dto/contributor/request/contributor-register.req';

export class ContributorRegisterByEmailCache {
  contributorRegisterReq!: ContributorRegisterReq;

  otp!: string;

  constructor(contributorRegisterReq: ContributorRegisterReq, otp: string) {
    this.contributorRegisterReq = contributorRegisterReq;
    this.otp = otp;
  }
}
