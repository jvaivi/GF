import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { Integration } from '../entity/integration.entity';
import { IntegrationId } from '../value';

export abstract class IIntegrationRepository extends IRepository<IntegrationId, Integration> {
  abstract selectAll(builder: FirestoreQueryBuilder<Integration>): Observable<Integration>;
}
