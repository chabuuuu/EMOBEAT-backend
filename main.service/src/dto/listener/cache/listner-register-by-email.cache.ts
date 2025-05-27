import { ListenerResgisterReq } from '@/dto/listener/request/listener-register.req';

export class ListnerRegisterByEmailCache {
  listnerRegisterReq!: ListenerResgisterReq;

  otp!: string;

  constructor(listnerRegisterReq: ListenerResgisterReq, otp: string) {
    this.listnerRegisterReq = listnerRegisterReq;
    this.otp = otp;
  }
}
