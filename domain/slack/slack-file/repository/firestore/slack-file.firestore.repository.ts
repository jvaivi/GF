import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { SlackMessageId } from '../../../slack-message';
import { SlackFile } from '../../entity/slack-file.entity';
import { SlackFileNotFoundError } from '../../exception/slack-file-notfound.exception';
import { SlackFileDownloadUrl, SlackFileId, SlackFileName, SlackFilePermalink, SlackFileSize, SlackFileType } from '../../value';
import { SlackFileMimetype } from '../../value/slack-file-mimetype.value';
import { ISlackFileRepository } from '../slack-file.repository';

export class SlackFileFirestoreRepository implements ISlackFileRepository {
  private static readonly collectionId = 'slack_file';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: SlackFileId): Observable<SlackFile> {
    return this.firestoreService.getDocument(SlackFileFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new SlackFileNotFoundError('slack file is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  selectAll(builder: FirestoreQueryBuilder<SlackFile>): Observable<SlackFile> {
    return this.firestoreService.getCollection(SlackFileFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(SlackFileFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  insert(item: SlackFile): Observable<SlackFile> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(SlackFileFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(file: SlackFile): Observable<SlackFile> {
    const currentMillsecUnixTimestap = +new Date();
    file.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(SlackFileFirestoreRepository.collectionId, file.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new SlackFileNotFoundError('slack file is not found');
        }
        return this.firestoreService.setDocument(SlackFileFirestoreRepository.collectionId, this.convertToMap(file));
      }),
      map(_ => file)
    );
  }

  delete(id: SlackFileId): Observable<void> {
    return this.firestoreService.deleteDocument(SlackFileFirestoreRepository.collectionId, id);
  }

  generateId(): SlackFileId {
    return SlackFileId.create(this.firestoreService.generateId());
  }

  private convertToMap(reaction: SlackFile): object {
    return SlackFile.allFields.reduce((p, key) => {
      if (reaction[key] === undefined) {
        return p;
      }
      const value = reaction[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const slackFile = new SlackFile(SlackFileId.create(item.id));
    slackFile.slackMessageId = SlackMessageId.create(item.slackMessageId);
    slackFile.name = SlackFileName.create(item.name);
    slackFile.mimetype = SlackFileMimetype.create(item.mimetype);
    slackFile.size = SlackFileSize.create(item.size);
    slackFile.type = SlackFileType.create(item.type);
    slackFile.downloadUrl = SlackFileDownloadUrl.create(item.downloadUrl);
    slackFile.permalink = SlackFilePermalink.create(item.permalink);
    slackFile.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    slackFile.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return slackFile;
  }
}
