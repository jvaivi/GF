import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { AccountId } from '../../../account';
import { OrganizationId } from '../../../organization/value';
import { Category } from '../../entity/category.entity';
import { CategoryNotFoundError } from '../../exception/category-notfound.exception';
import { CategoryDescription, CategoryId, CategoryLabel } from '../../value';
import { ICategoryRepository } from '../category.repository';

export class CategoryFirestoreRepository implements ICategoryRepository {
  private static readonly collectionId = 'category';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: CategoryId): Observable<Category> {
    return this.firestoreService.getDocument(CategoryFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new CategoryNotFoundError('category is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  insert(item: Category): Observable<Category> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(CategoryFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(category: Category): Observable<Category> {
    const currentMillsecUnixTimestap = +new Date();
    category.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(CategoryFirestoreRepository.collectionId, category.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new CategoryNotFoundError('category is not found');
        }
        return this.firestoreService.setDocument(CategoryFirestoreRepository.collectionId, this.convertToMap(category));
      }),
      map(_ => category)
    );
  }

  delete(id: CategoryId): Observable<void> {
    return this.firestoreService.deleteDocument(CategoryFirestoreRepository.collectionId, id);
  }

  generateId(): CategoryId {
    return CategoryId.create(this.firestoreService.generateId());
  }

  selectAll(builder: FirestoreQueryBuilder<Category>) {
    return this.firestoreService.getCollection(CategoryFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(CategoryFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  private convertToMap(category: Category): object {
    return Category.allFields.reduce((p, key) => {
      if (category[key] === undefined) {
        return p;
      }
      const value = category[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const category = new Category(CategoryId.create(item.id));
    category.organizationId = OrganizationId.create(item.organizationId);
    category.label = CategoryLabel.create(item.label);
    category.description = CategoryDescription.create(item.description);
    category.createdBy = AccountId.create(item.createdBy);
    category.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    category.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return category;
  }
}
