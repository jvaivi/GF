import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { ReactionIntegration } from '../entity';
import { ReactionIntegrationId } from '../value';

export abstract class IReactionIntegrationRepository extends IRepository<ReactionIntegrationId, ReactionIntegration> {
  abstract selectAll(builder: FirestoreQueryBuilder<ReactionIntegration>): Observable<ReactionIntegration>;
}
