import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from 'gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { SlackMessage } from '../entity/slack-message.entity';
import { SlackMessageId } from '../value';

export abstract class ISlackMessageRepository extends IRepository<SlackMessageId, SlackMessage> {
  abstract selectAll(builder: FirestoreQueryBuilder<SlackMessage>): Observable<SlackMessage>;
}
