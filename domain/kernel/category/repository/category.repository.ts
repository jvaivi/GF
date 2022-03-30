import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { Category } from '../entity/category.entity';
import { CategoryId } from '../value';

export abstract class ICategoryRepository extends IRepository<CategoryId, Category> {
  abstract selectAll(builder: FirestoreQueryBuilder<Category>): Observable<Category>;
}
