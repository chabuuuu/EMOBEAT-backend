import { CategoryCreateReq } from '@/dto/category/category-create.req';
import { CategoryUpdateReq } from '@/dto/category/category-update.req';
import { CategorySearchRes } from '@/dto/category/catgory-search.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Category } from '@/models/category.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ICategoryService<T extends BaseModelType> extends IBaseCrudService<T> {
  getAll(): Promise<CategorySearchRes[]>;
  search(searchData: SearchDataDto): Promise<PagingResponseDto<CategorySearchRes>>;
  getById(id: number): Promise<Category | null>;
  createNew(categoryCreateReq: CategoryCreateReq): Promise<void>;
  updateById(id: number, categoryUpdateReq: CategoryUpdateReq): Promise<void>;
}
