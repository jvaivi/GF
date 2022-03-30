import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { AccountOrganizationId } from '../../../account';
import { KnowledgeId } from '../../../knowledge';
import { CategoryKnowledge } from '../../entity';
import { CategoryNotFoundError } from '../../exception/category-notfound.exception';
import { CategoryId, CategoryKnowledgeId } from '../../value';
import { ICategoryKnowledgeRepository } from '../category-knowledge.repository';

export class CategoryKnowledgeFirestoreRepository implements ICategoryKnowledgeRepository {
  private static readonly collectionId = 'category_knowledge';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: CategoryKnowledgeId): Observable<CategoryKnowledge> {
    return this.firestoreService.getDocument(CategoryKnowledgeFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new CategoryNotFoundError('category-knowledge is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  insert(item: CategoryKnowledge): Observable<CategoryKnowledge> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService
      .setDocument(CategoryKnowledgeFirestoreRepository.collectionId, this.convertToMap(item))
      .pipe(map(() => item));
  }

  update(category: CategoryKnowledge): Observable<CategoryKnowledge> {
    const currentMillsecUnixTimestap = +new Date();
    category.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(CategoryKnowledgeFirestoreRepository.collectionId, category.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new CategoryNotFoundError('category-knowledge is not found');
        }
        return this.firestoreService.setDocument(CategoryKnowledgeFirestoreRepository.collectionId, this.convertToMap(category));
      }),
      map(_ => category)
    );
  }

  delete(id: CategoryKnowledgeId): Observable<void> {
    return this.firestoreService.deleteDocument(CategoryKnowledgeFirestoreRepository.collectionId, id);
  }

  generateId(): CategoryKnowledgeId {
    return CategoryId.create(this.firestoreService.generateId());
  }

  selectAll(builder: FirestoreQueryBuilder<CategoryKnowledge>) {
    return this.firestoreService.getCollection(CategoryKnowledgeFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(CategoryKnowledgeFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  private convertToMap(category: CategoryKnowledge): object {
    return CategoryKnowledge.allFields.reduce((p, key) => {
      if (category[key] === undefined) {
        return p;
      }
      const value = category[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const categoryKnowledge = new CategoryKnowledge(CategoryKnowledgeId.create(item.id));
    categoryKnowledge.knowledgeId = KnowledgeId.create(item.knowledgeId);
    categoryKnowledge.categoryId = CategoryId.create(item.categoryId);
    categoryKnowledge.createdBy = item.createdBy ? AccountOrganizationId.create(item.createdBy) : undefined;
    categoryKnowledge.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    categoryKnowledge.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return categoryKnowledge;
  }
}
