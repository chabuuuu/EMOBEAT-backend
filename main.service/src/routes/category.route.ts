import { categoryController } from '@/container/category.container';
import { CategoryCreateReq } from '@/dto/category/category-create.req';
import { CategoryUpdateReq } from '@/dto/category/category-update.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const categoryRouter = express.Router();

categoryRouter

  .delete(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    categoryController.common.delete.bind(categoryController.common)
  )

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(CategoryUpdateReq),
    categoryController.updateById.bind(categoryController)
  )

  .post('/search', categoryController.search.bind(categoryController))

  .post(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(CategoryCreateReq),
    categoryController.createNew.bind(categoryController)
  )

  .get('/:id', categoryController.getById.bind(categoryController))

  .get('/', categoryController.getAll.bind(categoryController));

export default categoryRouter;
