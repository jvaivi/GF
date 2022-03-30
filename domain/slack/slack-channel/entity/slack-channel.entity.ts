import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackChannelId, SlackChannelName } from '../value';

export class SlackChannel implements Entity {
  @Column()
  readonly id: SlackChannelId;
  @Column()
  name: SlackChannelName;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: SlackChannelId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof SlackChannel)[] {
    return getColumns(new SlackChannel(SlackChannelId.create('')));
  }

  equals(value: SlackChannel): boolean {
    return this.id.equals(value.id);
  }
}
