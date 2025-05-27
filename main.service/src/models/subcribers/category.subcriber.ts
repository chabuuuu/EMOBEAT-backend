import { Category } from '@/models/category.model';
import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from 'typeorm';

@EventSubscriber()
export class CategorySubscriber implements EntitySubscriberInterface<Category> {
  /**
   * Chỉ định entity mà subscriber này áp dụng
   */
  listenTo() {
    return Category;
  }

  /**
   * Tăng listenCount mỗi khi một bản ghi Music được load
   */
  async afterLoad(entity: Category, event?: LoadEvent<Category>): Promise<void> {
    const categoryRepository = event?.manager.getRepository(Category);

    if (categoryRepository) {
      categoryRepository.increment({ id: entity.id }, 'viewCount', 1);
    }
  }
}
