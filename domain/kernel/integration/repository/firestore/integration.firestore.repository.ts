import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { AccountId } from '../../../account';
import { Integration } from '../../entity';
import { IntegrationNotFoundError } from '../../exception/integration-notfound.exception';
import { AccessToken, IntegrationId, TargetId, TargetType } from '../../value';
import { IIntegrationRepository } from '../integration.repository';

export class IntegrationFirestoreRepository implements IIntegrationRepository {
  private static readonly collectionId = 'integration';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: IntegrationId): Observable<Integration> {
    return this.firestoreService.getDocument(IntegrationFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new IntegrationNotFoundError('integration is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  insert(item: Integration): Observable<Integration> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(IntegrationFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(integration: Integration): Observable<Integration> {
    const currentMillsecUnixTimestap = +new Date();
    integration.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(IntegrationFirestoreRepository.collectionId, integration.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new IntegrationNotFoundError('integration is not found');
        }
        return this.firestoreService.setDocument(IntegrationFirestoreRepository.collectionId, this.convertToMap(integration));
      }),
      map(_ => integration)
    );
  }

  delete(id: IntegrationId): Observable<void> {
    return this.firestoreService.deleteDocument(IntegrationFirestoreRepository.collectionId, id);
  }

  generateId(): IntegrationId {
    return IntegrationId.create(this.firestoreService.generateId());
  }

  selectAll(builder: FirestoreQueryBuilder<Integration>) {
    return this.firestoreService.getCollection(IntegrationFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(IntegrationFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  private convertToMap(integration: Integration): object {
    return Integration.allFields.reduce((p, key) => {
      if (integration[key] === undefined) {
        return p;
      }
      const value = integration[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const integration = new Integration(IntegrationId.create(item.id));
    integration.accountOrganizationId = AccountId.create(item.accountOrganizationId);
    integration.accessToken = AccessToken.create(item.accessToken);
    integration.targetId = TargetId.create(item.targetId);
    integration.targetType = TargetType.create(item.targetType);
    integration.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    integration.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return integration;
  }
}
