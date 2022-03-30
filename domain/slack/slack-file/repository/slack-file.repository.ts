import { Observable } from 'rxjs';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { IRepository } from '../../../../utility/repository/repository';
import { SlackFile } from '../entity/slack-file.entity';
import { SlackFileId } from '../value';

export abstract class ISlackFileRepository extends IRepository<SlackFileId, SlackFile> {
  abstract selectAll(builder: FirestoreQueryBuilder<SlackFile>): Observable<SlackFile>;
}
