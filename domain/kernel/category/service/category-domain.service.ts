import { map, mergeMap, take, tap } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountId } from '../../../kernel/account';
import { OrganizationId } from '../../../kernel/organization';
import { CategoryDto } from '../dto/category.dto';
import { Category } from '../entity/category.entity';
import { ICategoryRepository } from '../repository';
import { CategoryDescription, CategoryId, CategoryLabel } from '../value';

export class CategoryDomainService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  select(categoryId: string) {
    return this.categoryRepository.select(CategoryId.create(categoryId)).pipe(map(item => this.convertDto(item)));
  }

  selectAllByOrganizationId(organizationId: string) {
    return this.categoryRepository
      .selectAll(new FirestoreQueryBuilder<Category>().equalWhere('organizationId', organizationId))
      .pipe(map(item => this.convertDto(item)));
  }

  insert(organizationId: string, label: string, description: string, createdBy: string) {
    const newCategory = new Category(this.categoryRepository.generateId());
    newCategory.organizationId = OrganizationId.create(organizationId);
    newCategory.label = CategoryLabel.create(label);
    newCategory.description = CategoryDescription.create(description);
    newCategory.createdBy = AccountId.create(createdBy);
    newCategory.createdAt = Timestamp.createByMillsec(Date.now());
    newCategory.updatedAt = Timestamp.createByMillsec(Date.now());

    return this.categoryRepository.insert(newCategory).pipe(map(item => this.convertDto(item)));
  }

  update(category: CategoryDto) {
    return this.categoryRepository.select(CategoryId.create(category.id)).pipe(
      take(1),
      map(item => {
        const newCategory = new Category(CategoryId.create(category.id));
        newCategory.organizationId = OrganizationId.create(category.organizationId);
        newCategory.label = CategoryLabel.create(category.label);
        newCategory.description = CategoryDescription.create(category.description);
        newCategory.createdBy = AccountId.create(category.createdBy);
        newCategory.createdAt = item.createdAt;
        newCategory.updatedAt = Timestamp.createByMillsec(Date.now());
        return newCategory;
      }),
      mergeMap(newCategory => this.categoryRepository.update(newCategory)),
      map(item => this.convertDto(item))
    );
  }

  delete(categoryId: string) {
    return this.categoryRepository.delete(CategoryId.create(categoryId));
  }

  private convertDto(category: Category): CategoryDto {
    return Category.allFields.reduce((p, key) => {
      if (category[key] === undefined) {
        return p;
      }
      const value = category[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as CategoryDto);
  }
}
