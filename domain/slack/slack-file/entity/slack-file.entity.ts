import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackFileMimetype } from '../value/slack-file-mimetype.value';
import { SlackMessageId } from '../../slack-message';
import { SlackFileDownloadUrl, SlackFileId, SlackFileName, SlackFilePermalink, SlackFileSize, SlackFileType } from '../value';

export class SlackFile implements Entity {
  @Column()
  readonly id: SlackFileId;
  @Column()
  slackMessageId: SlackMessageId;
  @Column()
  name: SlackFileName;
  @Column()
  mimetype: SlackFileMimetype;
  @Column()
  type: SlackFileType;
  @Column()
  size: SlackFileSize;
  @Column()
  downloadUrl: SlackFileDownloadUrl;
  @Column()
  permalink: SlackFilePermalink;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: SlackFileId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof SlackFile)[] {
    return getColumns(new SlackFile(SlackFileId.create('')));
  }

  equals(value: SlackFile): boolean {
    return this.id.equals(value.id);
  }
}
