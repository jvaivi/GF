import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from './../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from './../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { FeedbackId, IntegrationId, TargetType } from '../../value';
import { IFeedbackRepository } from '../feedback.repository';
import { FeedbackNotFoundError } from '../../exception/feedback-notfound.exception';
import { FeedbackStatus } from '../../value/feedback-status.value';
import { Feedback } from '../../entity';
import { KnowledgeId } from '../../../knowledge/value';

export class FeedbackFirestoreRepository implements IFeedbackRepository {
  private static readonly collectionId = 'feedback';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: FeedbackId): Observable<Feedback> {
    return this.firestoreService.getDocument(FeedbackFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new FeedbackNotFoundError('feedback is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  insert(item: Feedback): Observable<Feedback> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(FeedbackFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(feedback: Feedback): Observable<Feedback> {
    const currentMillsecUnixTimestap = +new Date();
    feedback.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(FeedbackFirestoreRepository.collectionId, feedback.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new FeedbackNotFoundError('feedback is not found');
        }
        return this.firestoreService.setDocument(FeedbackFirestoreRepository.collectionId, this.convertToMap(feedback));
      }),
      map(_ => feedback)
    );
  }

  delete(id: FeedbackId): Observable<void> {
    return this.firestoreService.deleteDocument(FeedbackFirestoreRepository.collectionId, id);
  }

  generateId(): FeedbackId {
    return FeedbackId.create(this.firestoreService.generateId());
  }

  selectAll(builder: FirestoreQueryBuilder<Feedback>) {
    return this.firestoreService.getCollection(FeedbackFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(FeedbackFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  private convertToMap(feedback: Feedback): object {
    return Feedback.allFields.reduce((p, key) => {
      if (feedback[key] === undefined) {
        return p;
      }
      const value = feedback[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const feedback = new Feedback(FeedbackId.create(item.id));
    feedback.knowledgeId = KnowledgeId.create(item.knowledgeId);
    feedback.from = IntegrationId.create(item.from);
    feedback.to = IntegrationId.create(item.to);
    feedback.targetType = TargetType.create(item.targetType);
    feedback.status = FeedbackStatus.create(item.status);
    feedback.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    feedback.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return feedback;
  }
}
