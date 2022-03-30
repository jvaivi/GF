// tslint:disable: variable-name
import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackMessageId } from '../../slack-message';
import { SlackUserId } from '../../slack-user/value';
import { SlackReactionId, SlackReactionTs, SlackReactionType } from '../value';

export class SlackReaction implements Entity {
  @Column()
  readonly id: SlackReactionId;
  @Column()
  userId: SlackUserId;
  @Column()
  messageId: SlackMessageId;
  @Column()
  type: SlackReactionType;
  @Column()
  ts: SlackReactionTs;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: SlackMessageId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof SlackReaction)[] {
    return getColumns(new SlackReaction(SlackReactionId.create('')));
  }

  equals(value: SlackReaction): boolean {
    return this.id.equals(value.id);
  }
}
