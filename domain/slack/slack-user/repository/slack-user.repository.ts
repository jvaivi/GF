import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { SlackUser } from '../entity/slack-user.entity';
import { SlackUserId } from '../value';

export abstract class ISlackUserRepository extends IRepository<SlackUserId, SlackUser> {
  abstract selectAll(builder: FirestoreQueryBuilder<SlackUser>): Observable<SlackUser>;
}
