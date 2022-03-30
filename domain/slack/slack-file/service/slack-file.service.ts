import { concat, EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, take, tap, toArray } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackMessageId } from '../../slack-message/value';
import { SlackFileDto } from '../dto/slack-file.dto';
import { SlackFile } from '../entity/slack-file.entity';
import { SlackFileNotFoundError } from '../exception/slack-file-notfound.exception';
import { ISlackFileRepository } from '../repository';
import { SlackFileDownloadUrl, SlackFileId, SlackFileName, SlackFilePermalink, SlackFileSize, SlackFileType } from '../value';
import { SlackFileMimetype } from '../value/slack-file-mimetype.value';

export class SlackFileDomainService {
  constructor(private readonly slackFileRepository: ISlackFileRepository) {}

  selectAllFilesBySlackMessageId(slackMessageId: string) {
    return this.slackFileRepository
      .selectAll(new FirestoreQueryBuilder<SlackFile>().equalWhere('slackMessageId', slackMessageId))
      .pipe(map(item => this.convertDto(item)));
  }

  insertSlackFile(
    id: string,
    slackMessageId: string,
    name: string,
    mimetype: string,
    type: string,
    size: number,
    downloadUrl: string,
    permalink: string
  ) {
    return this.slackFileRepository.select(SlackFileId.create(id)).pipe(
      take(1),
      catchError(err => {
        if (err instanceof SlackFileNotFoundError) {
          const slackFile = new SlackFile(SlackFileId.create(id));
          slackFile.slackMessageId = SlackMessageId.create(slackMessageId);
          slackFile.name = SlackFileName.create(name);
          slackFile.mimetype = SlackFileMimetype.create(mimetype);
          slackFile.size = SlackFileSize.create(size);
          slackFile.type = SlackFileType.create(type);
          slackFile.downloadUrl = SlackFileDownloadUrl.create(downloadUrl);
          slackFile.permalink = SlackFilePermalink.create(permalink);
          slackFile.createdAt = Timestamp.createByMillsec(Date.now());
          slackFile.updatedAt = Timestamp.createByMillsec(Date.now());
          return this.slackFileRepository.insert(slackFile).pipe(map(item => this.convertDto(item)));
        } else {
          return EMPTY;
        }
      })
    );
  }

  deleteAllBySlackMessageId(slackMessageId: string) {
    return concat(
      this.slackFileRepository.selectAll(new FirestoreQueryBuilder<SlackFile>().equalWhere('slackMessageId', slackMessageId)).pipe(
        mergeMap(item => this.slackFileRepository.delete(item.id)),
        toArray()
      ),
      of(null)
    );
  }

  private convertDto(slackFile: SlackFile): SlackFileDto {
    return SlackFile.allFields.reduce((p, key) => {
      if (slackFile[key] === undefined) {
        return p;
      }
      const value = slackFile[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as SlackFileDto);
  }
}
