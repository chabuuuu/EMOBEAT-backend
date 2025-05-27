import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Category } from '@/models/category.model';
import { ICategoryService } from '@/service/interface/i.category.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/search/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class CategoryController {
  public common: IBaseCrudController<Category>;
  private categoryService: ICategoryService<Category>;
  constructor(
    @inject('CategoryService') categoryService: ICategoryService<Category>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Category>
  ) {
    this.categoryService = categoryService;
    this.common = common;
  }

  /**
   * * POST /category/
   */
  async createNew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.categoryService.createNew(req.body);

      res.send_created('Category created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * PUT /category/:id
   */
  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.categoryService.updateById(Number(req.params.id), req.body);

      res.send_ok('Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /category/:id
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await this.categoryService.getById(Number(req.params.id));

      res.send_ok('Category found successfully', category);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /category/search
   * @param req
   * @param res
   * @param next
   */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.categoryService.search(searchData);

      res.send_ok('Category fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * * GET /category/
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.categoryService.getAll();

      res.send_ok('Categories fetched successfully', categories);
    } catch (error) {
      next(error);
    }
  }
}
