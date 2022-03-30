import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { SlackChannel } from '../entity/slack-channel.entity';
import { SlackChannelId } from '../value';

export abstract class ISlackChannelRepository extends IRepository<SlackChannelId, SlackChannel> {
  abstract selectAll(builder: FirestoreQueryBuilder<SlackChannel>): Observable<SlackChannel>;
}
