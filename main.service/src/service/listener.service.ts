import { TIME_CONSTANTS } from '@/constants/time.constants';
import { ListnerRegisterByEmailCache } from '@/dto/listener/cache/listner-register-by-email.cache';
import { ListnerLoginReq } from '@/dto/listener/request/listener-login.req';
import { ListenerResgisterReq } from '@/dto/listener/request/listener-register.req';
import { ListenerUpdateReq } from '@/dto/listener/request/listener-update.req';
import { ListenerDetailRes } from '@/dto/listener/response/listener-detail.res';
import { ListenerSearchRes } from '@/dto/listener/response/listener-search.res';
import { ListnerGetMeRes } from '@/dto/listener/response/listner-get-me.res';
import { ListnerLoginRes } from '@/dto/listener/response/listner-login.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { RedisSchemaEnum } from '@/enums/redis-schema.enum';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { ListenerActiveEmailException } from '@/exceptions/listener/listener-active-email.exception';
import { ListenerGetByIdException } from '@/exceptions/listener/listener-get-by-id.exception';
import { ListenerLoginException } from '@/exceptions/listener/listener-login.exception';
import { ListenerRegisterException } from '@/exceptions/listener/listener-register.exception';
import { ListenerUpdateByIdException } from '@/exceptions/listener/listener-update-by-id.exception';
import { Listener } from '@/models/listener.model';
import { IListenerRepository } from '@/repository/interface/i.listener.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IListenerService } from '@/service/interface/i.listener.service';
import { sendEmail } from '@/utils/email/email-sender.util';
import DefinedError from '@/utils/error/defined.error';
import { generateRandomOTPString } from '@/utils/generate-random-string.util';
import redis from '@/utils/redis/redis.util';
import { SearchUtil } from '@/utils/search/search.util';
import { generateAccessToken } from '@/utils/security/generate-access-token.util';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import validator from 'validator';

@injectable()
export class ListenerService extends BaseCrudService<Listener> implements IListenerService<Listener> {
  private listenerRepository: IListenerRepository<Listener>;

  constructor(@inject('ListenerRepository') listenerRepository: IListenerRepository<Listener>) {
    super(listenerRepository);
    this.listenerRepository = listenerRepository;
  }

  async updateById(id: number, data: ListenerUpdateReq): Promise<void> {
    const listener = await this.listenerRepository.findOne({
      filter: {
        id: id
      }
    });

    if (!listener) {
      throw new DefinedError(ListenerUpdateByIdException.LISTENER_UPDATE_BY_ID_NotFound);
    }

    await this.listenerRepository.findOneAndUpdate({
      filter: {
        id: id
      },
      updateData: {
        fullname: data.fullname ? data.fullname : undefined,
        gender: data.gender ? data.gender : undefined
      }
    });
  }

  async getById(id: number): Promise<ListenerDetailRes> {
    const listener = await this.listenerRepository.findOne({
      filter: {
        id: id
      },
      relations: ['favoriteLists', 'favoriteLists.music']
    });
    if (!listener) {
      throw new DefinedError(ListenerGetByIdException.LISTENER_GET_BY_ID_NotFound);
    }

    return {
      id: listener.id,
      username: listener.username,
      fullname: listener.fullname,
      gender: listener.gender,
      email: listener.email,
      createAt: listener.createAt,
      updateAt: listener.updateAt,
      favoriteLists: listener.favoriteLists
    };
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<ListenerSearchRes>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const listeners = await this.listenerRepository.findMany({
      filter: where,
      order: order,
      paging: paging,
      select: {
        id: true,
        email: true,
        username: true,
        fullname: true,
        gender: true,
        createAt: true,
        updateAt: true
      }
    });

    const total = await this.listenerRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, listeners);
  }

  async activateEmail(email: string, otp: string): Promise<void> {
    const emailActivateCached = await redis.get(`${RedisSchemaEnum.ListnerRegisterByEmail}:${email}`);

    // If not found in cache, that mean otp is expired
    if (!emailActivateCached) {
      throw new DefinedError(ListenerActiveEmailException.LISTENER_ACTIVE_EMAIL_OtpExpired);
    }

    // If otp is not match, that mean otp is expired
    const listenerRegisterByEmailCache: ListnerRegisterByEmailCache = JSON.parse(emailActivateCached);
    if (listenerRegisterByEmailCache.otp !== otp) {
      throw new DefinedError(ListenerActiveEmailException.LISTENER_ACTIVE_EMAIL_OtpExpired);
    }

    const { listnerRegisterReq } = listenerRegisterByEmailCache;

    let listener = new Listener();

    // Map data from request to entity
    listener = listnerRegisterReq as Listener;

    await this.listenerRepository.create({
      data: listener
    });
  }

  async register(listenerRegisterReq: ListenerResgisterReq): Promise<void> {
    // Rate limit register request by check in cache
    const emailActivateCached = await redis.get(
      `${RedisSchemaEnum.ListnerRegisterByEmail}:${listenerRegisterReq.email}`
    );

    // If found in cache, that mean this user is trying to register too many times
    if (emailActivateCached) {
      throw new DefinedError(ListenerRegisterException.LISTENER_REGISTER_TooManyRequest);
    }

    // Check if email is exists
    if (
      await this.listenerRepository.exists({
        filter: {
          email: listenerRegisterReq.email
        }
      })
    ) {
      throw new DefinedError(ListenerRegisterException.LISTENER_REGISTER_EmailExists);
    }

    // Check if username is exists
    if (
      await this.listenerRepository.exists({
        filter: {
          username: listenerRegisterReq.username
        }
      })
    ) {
      throw new DefinedError(ListenerRegisterException.LISTENER_REGISTER_UsernameExists);
    }

    // Hash password
    listenerRegisterReq.password = bcrypt.hashSync(listenerRegisterReq.password, 12);

    const otp = generateRandomOTPString(6);

    redis.set(
      `${RedisSchemaEnum.ListnerRegisterByEmail}:${listenerRegisterReq.email}`,
      JSON.stringify(new ListnerRegisterByEmailCache(listenerRegisterReq, otp)),
      'EX',
      (TIME_CONSTANTS.MINUTE * 3) / 1000
    );

    //Valid phone number or email
    sendEmail({
      from: { name: 'EMOBEAT - Nền tảng nhạc theo cảm xúc đầu tiên trên thế giới' },
      to: {
        emailAddress: [listenerRegisterReq.email]
      },
      subject: 'Xác thực tài khoản EMOBEAT',
      text: `Mã xác thực của bạn là: ${otp}`
    });

    return;
  }

  async login(listnerLoginReq: ListnerLoginReq): Promise<ListnerLoginRes> {
    let listener: Listener | null = null;

    // If email is provide
    if (validator.isEmail(listnerLoginReq.usernameOrEmail)) {
      listener = await this.listenerRepository.findOne({
        filter: {
          email: listnerLoginReq.usernameOrEmail
        }
      });
    }

    // If username is provided
    else {
      listener = await this.listenerRepository.findOne({
        filter: {
          username: listnerLoginReq.usernameOrEmail
        }
      });
    }

    // If listener not found
    if (!listener) {
      throw new DefinedError(ListenerLoginException.LISTENER_LOGIN_NotFound);
    }

    // Compare password
    if (!bcrypt.compareSync(listnerLoginReq.password, listener.password)) {
      throw new DefinedError(ListenerLoginException.LISTENER_LOGIN_WrongPasswordOrUsername);
    }

    // Generate token
    const accessToken = await generateAccessToken(listener.id, listener.username, RoleCodeEnum.LISTENER);

    // Return response
    return {
      accessToken: accessToken,
      id: Number(listener.id)
    };
  }

  async getMe(listnerId: number): Promise<ListnerGetMeRes> {
    const listener = await this.listenerRepository.findOne({
      filter: {
        id: listnerId
      },
      relations: ['favoriteLists', 'favoriteLists.music']
    });
    if (!listener) {
      throw new DefinedError(ListenerLoginException.LISTENER_LOGIN_NotFound);
    }

    return {
      id: listener.id,
      username: listener.username,
      fullname: listener.fullname,
      gender: listener.gender,
      email: listener.email,
      createAt: listener.createAt,
      updateAt: listener.updateAt,
      favoriteLists: listener.favoriteLists,
      nationality: listener.nationality,
      birthdate: listener.birthdate
    };
  }
}
