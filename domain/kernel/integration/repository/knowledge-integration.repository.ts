import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { KnowledgeIntegration } from '../entity/knowledge-integration.entity';
import { KnowledgeIntegrationId } from '../value/knowledge-integration-id.value';

export abstract class IKnowledgeIntegrationRepository extends IRepository<KnowledgeIntegrationId, KnowledgeIntegration> {
  abstract selectAll(builder: FirestoreQueryBuilder<KnowledgeIntegration>): Observable<KnowledgeIntegration>;
}
