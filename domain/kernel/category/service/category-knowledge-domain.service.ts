import { combineLatest, concat, of } from 'rxjs';
import { map, mergeMap, take, tap, toArray } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountOrganizationDomainService, AccountOrganizationId } from '../../account';
import { KnowledgeDomainService } from '../../knowledge';
import { KnowledgeId } from '../../knowledge/value';
import { CategoryKnowledgeDto } from '../dto/category-knowledge.dto';
import { CategoryKnowledge } from '../entity';
import { CategoryKnowledgeArleadyExistsError } from '../exception/category-knowledge-already-exists.exception';
import { ICategoryKnowledgeRepository } from '../repository/category-knowledge.repository';
import { CategoryId, CategoryKnowledgeId } from '../value';
import { CategoryDomainService } from './category-domain.service';

export class CategoryKnowledgeDomainService {
  constructor(
    private readonly knowledgeDomainService: KnowledgeDomainService,
    private readonly categoryDomainService: CategoryDomainService,
    private readonly accountOrganizationDomainService: AccountOrganizationDomainService,
    private readonly categoryKnowledgeRepository: ICategoryKnowledgeRepository
  ) {}

  selectAllByKnowledgeId(knowledgeId: string) {
    return this.categoryKnowledgeRepository
      .selectAll(new FirestoreQueryBuilder<CategoryKnowledge>().equalWhere('knowledgeId', knowledgeId))
      .pipe(map(item => this.convertDto(item)));
  }

  selectAllByKnowledgeIdAndCategoryId(knowledgeId: string, categoryId: string) {
    return this.categoryKnowledgeRepository
      .selectAll(new FirestoreQueryBuilder<CategoryKnowledge>().equalWhere('knowledgeId', knowledgeId).equalWhere('categoryId', categoryId))
      .pipe(map(item => this.convertDto(item)));
  }

  insert(knowledgeId: string, categoryId: string, createdBy: string) {
    return combineLatest([
      this.knowledgeDomainService.select(knowledgeId).pipe(take(1)),
      this.categoryDomainService.select(categoryId).pipe(take(1)),
      this.accountOrganizationDomainService.select(createdBy).pipe(take(1))
    ]).pipe(
      take(1),
      map(result => ({ knowledge: result[0], category: result[1], accountOrganization: result[2] })),
      mergeMap(result =>
        concat(
          this.categoryKnowledgeRepository.selectAll(
            new FirestoreQueryBuilder<CategoryKnowledge>()
              .equalWhere('knowledgeId', result.knowledge.id)
              .equalWhere('categoryId', result.category.id)
          ),
          of(null)
        ).pipe(
          take(1),
          map(item => {
            if (item !== null) {
              throw new CategoryKnowledgeArleadyExistsError();
            }
            const categoryKnowledge = new CategoryKnowledge(this.categoryKnowledgeRepository.generateId());
            categoryKnowledge.knowledgeId = KnowledgeId.create(result.knowledge.id);
            categoryKnowledge.categoryId = CategoryId.create(result.category.id);
            categoryKnowledge.createdBy = AccountOrganizationId.create(result.accountOrganization.id);
            categoryKnowledge.createdAt = Timestamp.createByMillsec(Date.now());
            categoryKnowledge.updatedAt = Timestamp.createByMillsec(Date.now());
            return categoryKnowledge;
          })
        )
      ),
      mergeMap(categoryKnowledge => this.categoryKnowledgeRepository.insert(categoryKnowledge)),
      map(item => this.convertDto(item))
    );
  }

  delete(categoryKnowledgeId: string) {
    return this.categoryKnowledgeRepository.delete(CategoryKnowledgeId.create(categoryKnowledgeId));
  }

  deleteAllByKnowledgeId(knowledgeId: string) {
    return concat(
      this.categoryKnowledgeRepository
        .selectAll(new FirestoreQueryBuilder<CategoryKnowledge>().equalWhere('knowledgeId', knowledgeId))
        .pipe(
          mergeMap(item => this.categoryKnowledgeRepository.delete(item.id)),
          toArray()
        ),
      of(null)
    );
  }

  private convertDto(categoryKnowledge: CategoryKnowledge): CategoryKnowledgeDto {
    return CategoryKnowledge.allFields.reduce((p, key) => {
      if (categoryKnowledge[key] === undefined) {
        return p;
      }
      const value = categoryKnowledge[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as CategoryKnowledgeDto);
  }
}
