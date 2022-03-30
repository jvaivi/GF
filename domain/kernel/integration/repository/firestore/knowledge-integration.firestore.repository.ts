import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { KnowledgeId } from '../../../knowledge';
import { KnowledgeIntegration } from '../../entity/knowledge-integration.entity';
import { KnowledgeIntegrationNotFoundError } from '../../exception/knowledge-integration-notfound.exception';
import { KnowledgeIntegrationId, TargetId, TargetType } from '../../value';
import { IKnowledgeIntegrationRepository } from '../knowledge-integration.repository';

export class KnowledgeIntegrationFirestoreRepository implements IKnowledgeIntegrationRepository {
  private static readonly collectionId = 'knowledge_integration';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: KnowledgeIntegrationId): Observable<KnowledgeIntegration> {
    return this.firestoreService.getDocument(KnowledgeIntegrationFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new KnowledgeIntegrationNotFoundError('integration action is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  insert(item: KnowledgeIntegration): Observable<KnowledgeIntegration> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService
      .setDocument(KnowledgeIntegrationFirestoreRepository.collectionId, this.convertToMap(item))
      .pipe(map(() => item));
  }

  update(integration: KnowledgeIntegration): Observable<KnowledgeIntegration> {
    const currentMillsecUnixTimestap = +new Date();
    integration.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(KnowledgeIntegrationFirestoreRepository.collectionId, integration.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new KnowledgeIntegrationNotFoundError('integration action is not found');
        }
        return this.firestoreService.setDocument(KnowledgeIntegrationFirestoreRepository.collectionId, this.convertToMap(integration));
      }),
      map(_ => integration)
    );
  }

  delete(id: KnowledgeIntegrationId): Observable<void> {
    return this.firestoreService.deleteDocument(KnowledgeIntegrationFirestoreRepository.collectionId, id);
  }

  generateId(): KnowledgeIntegrationId {
    return KnowledgeIntegrationId.create(this.firestoreService.generateId());
  }

  selectAll(builder: FirestoreQueryBuilder<KnowledgeIntegration>) {
    return this.firestoreService.getCollection(KnowledgeIntegrationFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(
                KnowledgeIntegrationFirestoreRepository.collectionId,
                builder.startAfter(items[items.length - 1].id).limit(100)
              )
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  private convertToMap(integration: KnowledgeIntegration): object {
    return KnowledgeIntegration.allFields.reduce((p, key) => {
      if (integration[key] === undefined) {
        return p;
      }
      const value = integration[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const integration = new KnowledgeIntegration(KnowledgeIntegrationId.create(item.id));
    integration.knowledgeId = KnowledgeId.create(item.knowledgeId);
    integration.targetId = TargetId.create(item.targetId);
    integration.targetType = TargetType.create(item.targetType);
    integration.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    integration.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return integration;
  }
}
