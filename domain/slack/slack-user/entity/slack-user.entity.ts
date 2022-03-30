import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackTeamId, SlackUserDisplayName, SlackUserId, SlackUserImage, SlackUserName } from '../value';

export class SlackUser implements Entity {
  @Column()
  readonly id: SlackUserId;
  @Column()
  teamId: SlackTeamId;
  @Column()
  name: SlackUserName;
  @Column()
  displayName: SlackUserDisplayName;
  @Column()
  image: SlackUserImage;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: SlackUserId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof SlackUser)[] {
    return getColumns(new SlackUser(SlackUserId.create('')));
  }

  equals(value: SlackUser): boolean {
    return this.id.equals(value.id);
  }
}
