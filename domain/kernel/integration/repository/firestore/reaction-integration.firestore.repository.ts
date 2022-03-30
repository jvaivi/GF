import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { ReactionId } from '../../../reaction';
import { ReactionIntegration } from '../../entity/reaction-integration.entity';
import { ReactionIntegrationNotFoundError } from '../../exception/reaction-integration-notfound.exception';
import { DataType, ReactionIntegrationId, TargetId, TargetType } from '../../value';
import { IReactionIntegrationRepository } from '../reaction-integration.repository';

export class ReactionIntegrationFirestoreRepository implements IReactionIntegrationRepository {
  private static readonly collectionId = 'reaction_integration';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: ReactionIntegrationId): Observable<ReactionIntegration> {
    return this.firestoreService.getDocument(ReactionIntegrationFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new ReactionIntegrationNotFoundError('integration action is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  insert(item: ReactionIntegration): Observable<ReactionIntegration> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService
      .setDocument(ReactionIntegrationFirestoreRepository.collectionId, this.convertToMap(item))
      .pipe(map(() => item));
  }

  update(integration: ReactionIntegration): Observable<ReactionIntegration> {
    const currentMillsecUnixTimestap = +new Date();
    integration.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(ReactionIntegrationFirestoreRepository.collectionId, integration.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new ReactionIntegrationNotFoundError('integration action is not found');
        }
        return this.firestoreService.setDocument(ReactionIntegrationFirestoreRepository.collectionId, this.convertToMap(integration));
      }),
      map(_ => integration)
    );
  }

  delete(id: ReactionIntegrationId): Observable<void> {
    return this.firestoreService.deleteDocument(ReactionIntegrationFirestoreRepository.collectionId, id);
  }

  generateId(): ReactionIntegrationId {
    return ReactionIntegrationId.create(this.firestoreService.generateId());
  }

  selectAll(builder: FirestoreQueryBuilder<ReactionIntegration>) {
    return this.firestoreService.getCollection(ReactionIntegrationFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(ReactionIntegrationFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  private convertToMap(integration: ReactionIntegration): object {
    return ReactionIntegration.allFields.reduce((p, key) => {
      if (integration[key] === undefined) {
        return p;
      }
      const value = integration[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const integration = new ReactionIntegration(ReactionIntegrationId.create(item.id));
    integration.reactionId = ReactionId.create(item.reactionId);
    integration.targetId = TargetId.create(item.targetId);
    integration.targetType = TargetType.create(item.targetType);
    integration.dataType = DataType.create(item.dataType);
    integration.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    integration.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return integration;
  }
}
