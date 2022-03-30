import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { SlackReaction } from '../entity/slack-reaction.entity';
import { SlackReactionId } from '../value';

export abstract class ISlackReactionRepository extends IRepository<SlackReactionId, SlackReaction> {
  abstract selectAll(builder: FirestoreQueryBuilder<SlackReaction>): Observable<SlackReaction>;
}
