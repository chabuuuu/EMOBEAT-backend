import { CategorySearchRes } from '@/dto/category/catgory-search.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { Category } from '@/models/category.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';
import { RecordOrderType } from '@/types/record-order.types';

export interface ICategoryRepository<T> extends IBaseRepository<T> {
  findAllAndCountTotalMusics(): Promise<CategorySearchRes[]>;
  searchAndCountTotalMusics(
    where: Partial<Category>,
    rpp: number,
    page: number,
    order?: RecordOrderType[]
  ): Promise<PagingResponseDto<CategorySearchRes>>;
}
