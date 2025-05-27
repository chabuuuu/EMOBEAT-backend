import { CategorySearchRes } from '@/dto/category/catgory-search.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { Category } from '@/models/category.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ICategoryRepository } from '@/repository/interface/i.category.repository';
import { ITYPES } from '@/types/interface.types';
import { RecordOrderType } from '@/types/record-order.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource, FindOperator } from 'typeorm';

export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository<Category> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Category));
  }

  async searchAndCountTotalMusics(
    where: Partial<Category>,
    rpp: number,
    page: number,
    order?: RecordOrderType[]
  ): Promise<PagingResponseDto<CategorySearchRes>> {
    const qb = this.ormRepository
      .createQueryBuilder('category')
      .leftJoin('category.musics', 'music')
      .select([
        'category.id',
        'category.name',
        'category.picture',
        'category.description',
        'category.createAt',
        'category.updateAt',
        'category.viewCount'
      ])
      .addSelect('COUNT(music.id)', 'totalMusics')
      .groupBy('category.id');

    // Filter by deleteAt == null
    qb.where('category.deleteAt IS NULL');

    // Apply where conditions dynamically
    Object.entries(where).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // If is name, use LIKE
        if (key === 'name') {
          qb.andWhere(`category.${key} LIKE :${key}`, { [key]: (value as any)._value });
        } else {
          qb.andWhere(`category.${key} = :${key}`, { [key]: value });
        }
      }
    });

    // Sorting
    if (order) {
      order.forEach((o) => {
        qb.orderBy(`category.${o.column}`, o.direction);
      });
    }

    // Pagination
    qb.skip((page - 1) * rpp).take(rpp);

    // Get data and total count
    const [raws, total] = await Promise.all([qb.getRawAndEntities(), qb.getCount()]);

    const data = raws.entities.map((cat, idx) => {
      const res = new CategorySearchRes();
      res.id = cat.id;
      res.name = cat.name;
      res.picture = cat.picture;
      res.description = cat.description;
      res.viewCount = cat.viewCount;
      res.createAt = cat.createAt;
      res.updateAt = cat.updateAt;
      res.totalMusics = parseInt(raws.raw[idx].totalMusics, 10);
      return res;
    });

    return {
      items: data,
      total: total
    };
  }

  async findAllAndCountTotalMusics(): Promise<CategorySearchRes[]> {
    const categories = await this.ormRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.musics', 'music')
      .loadRelationCountAndMap('category.totalMusics', 'category.musics')
      .select([
        'category.id',
        'category.name',
        'category.picture',
        'category.description',
        'category.createAt',
        'category.updateAt',
        'category.viewCount'
      ])
      .addSelect('COUNT(music.id)', 'totalMusics')
      .andWhere('category.deleteAt IS NULL') // Filter by deleteAt == null
      .groupBy('category.id')
      .getRawAndEntities();

    // Map raw count to DTO
    return categories.entities.map((cat, idx) => {
      const res = new CategorySearchRes();
      res.id = cat.id;
      res.name = cat.name;
      res.picture = cat.picture;
      res.description = cat.description;
      res.createAt = cat.createAt;
      res.updateAt = cat.updateAt;
      res.viewCount = cat.viewCount;
      res.totalMusics = parseInt(categories.raw[idx].totalMusics, 10);
      return res;
    });
  }
}
