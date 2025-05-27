import { ListnerLoginReq } from '@/dto/listener/request/listener-login.req';
import { ListenerResgisterReq } from '@/dto/listener/request/listener-register.req';
import { ListenerUpdateReq } from '@/dto/listener/request/listener-update.req';
import { ListenerDetailRes } from '@/dto/listener/response/listener-detail.res';
import { ListenerSearchRes } from '@/dto/listener/response/listener-search.res';
import { ListnerGetMeRes } from '@/dto/listener/response/listner-get-me.res';
import { ListnerLoginRes } from '@/dto/listener/response/listner-login.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IListenerService<T extends BaseModelType> extends IBaseCrudService<T> {
  /**
   * Update listener by id
   * @param id
   * @param data
   */
  updateById(id: number, data: ListenerUpdateReq): Promise<void>;

  /**
   * Get listener by id
   * @param id
   */
  getById(id: number): Promise<ListenerDetailRes>;

  /**
   * Search listener
   * @param searchData
   */
  search(searchData: SearchDataDto): Promise<PagingResponseDto<ListenerSearchRes>>;

  /**
   * Login listener
   * @param listnerLoginReq
   */
  login(listnerLoginReq: ListnerLoginReq): Promise<ListnerLoginRes>;

  /**
   * Get current listener information
   * @param listnerId
   */
  getMe(listnerId: number): Promise<ListnerGetMeRes>;

  /**
   * Register listener
   * @param listenerRegisterReq
   */
  register(listenerRegisterReq: ListenerResgisterReq): Promise<void>;

  /**
   * Activate email by otp
   * @param email
   * @param otp
   */
  activateEmail(email: string, otp: string): Promise<void>;
}
