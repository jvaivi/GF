import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { FeedbackId } from '../value/feedback-id.value';
import { Feedback } from '../entity/feedback.entity';

export abstract class IFeedbackRepository extends IRepository<FeedbackId, Feedback> {
  abstract selectAll(builder: FirestoreQueryBuilder<Feedback>): Observable<Feedback>;
}
