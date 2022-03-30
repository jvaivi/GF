import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Observable } from 'rxjs';
import { IRepository } from '../../../../utility/repository/repository';
import { Organization } from '../entity/organization.entity';
import { OrganizationId } from '../value';

export abstract class IOrganizationRepository extends IRepository<OrganizationId, Organization> {
  abstract selectAll(builder: FirestoreQueryBuilder<Organization>): Observable<Organization>;
}
