import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { CategoryKnowledge } from '../entity';
import { CategoryKnowledgeId } from '../value';

export abstract class ICategoryKnowledgeRepository extends IRepository<CategoryKnowledgeId, CategoryKnowledge> {
  abstract selectAll(builder: FirestoreQueryBuilder<CategoryKnowledge>): Observable<CategoryKnowledge>;
}
