import { CategoryCreateReq } from '@/dto/category/category-create.req';
import { CategoryUpdateReq } from '@/dto/category/category-update.req';
import { CategorySearchRes } from '@/dto/category/catgory-search.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Category } from '@/models/category.model';
import { Music } from '@/models/music.model';
import { ICategoryRepository } from '@/repository/interface/i.category.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ICategoryService } from '@/service/interface/i.category.service';
import { SearchUtil } from '@/utils/search/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class CategoryService extends BaseCrudService<Category> implements ICategoryService<Category> {
  private categoryRepository: ICategoryRepository<Category>;

  constructor(@inject('CategoryRepository') categoryRepository: ICategoryRepository<Category>) {
    super(categoryRepository);
    this.categoryRepository = categoryRepository;
  }

  async getAll(): Promise<CategorySearchRes[]> {
    return await this.categoryRepository.findAllAndCountTotalMusics();
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<CategorySearchRes>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    console.log('where', where);

    return await this.categoryRepository.searchAndCountTotalMusics(where, paging.rpp, paging.page, order);
  }

  async getById(id: number): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({
      filter: {
        id: id
      },
      relations: ['musics']
    });

    if (!category) {
      return null;
    }

    return category;
  }

  async createNew(categoryCreateReq: CategoryCreateReq): Promise<void> {
    const category = new Category();
    category.name = categoryCreateReq.name;
    category.picture = categoryCreateReq.picture;
    category.description = categoryCreateReq.description;

    const musics = new Array<Music>();

    if (categoryCreateReq.musicIds) {
      for (const musicId of categoryCreateReq.musicIds) {
        const music = new Music();
        music.id = musicId;
        musics.push(music);
      }

      category.musics = musics;
    }

    await this.categoryRepository.create({ data: category });
  }

  async updateById(id: number, categoryUpdateReq: CategoryUpdateReq): Promise<void> {
    const category = await this.categoryRepository.findOne({
      filter: {
        id: id
      }
    });

    if (!category) {
      return;
    }

    category.name = categoryUpdateReq.name ? categoryUpdateReq.name : category.name;
    category.picture = categoryUpdateReq.picture ? categoryUpdateReq.picture : category.picture;
    category.description = categoryUpdateReq.description ? categoryUpdateReq.description : category.description;

    const musics = new Array<Music>();

    if (categoryUpdateReq.musicIds) {
      for (const musicId of categoryUpdateReq.musicIds) {
        const music = new Music();
        music.id = musicId;
        musics.push(music);
      }

      category.musics = musics;
    }

    await this.categoryRepository.save(category);
  }
}
