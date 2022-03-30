// tslint:disable: variable-name
import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackChannelId } from '../../slack-channel/value';
import { SlackUserId } from '../../slack-user/value';
import { SlackMessageId, SlackMessagePermalink, SlackMessageSubType, SlackMessageText, SlackMessageTs, SlackMessageType } from '../value';

export class SlackMessage implements Entity {
  @Column()
  readonly id: SlackMessageId;
  @Column()
  channelId: SlackChannelId;
  @Column()
  userId: SlackUserId;
  @Column()
  registeredBy: SlackUserId;
  @Column()
  ts: SlackMessageTs;
  @Column()
  type: SlackMessageType;
  @Column()
  subtype: SlackMessageSubType;
  @Column()
  text: SlackMessageText;
  @Column()
  permalink: SlackMessagePermalink;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: SlackMessageId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof SlackMessage)[] {
    return getColumns(new SlackMessage(SlackMessageId.create('')));
  }

  equals(value: SlackMessage): boolean {
    return this.id.equals(value.id);
  }
}
