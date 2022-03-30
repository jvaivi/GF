// tslint:disable: variable-name
import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { ReactionId } from '../../reaction';
import { DataType, ReactionIntegrationId, TargetId, TargetType } from '../value';

export class ReactionIntegration implements Entity {
  @Column()
  readonly id: ReactionIntegrationId;
  @Column()
  reactionId: ReactionId;
  @Column()
  targetId: TargetId;
  @Column()
  dataType: DataType;
  @Column()
  targetType: TargetType;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: ReactionIntegrationId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof ReactionIntegration)[] {
    return getColumns(new ReactionIntegration(ReactionIntegrationId.create('')));
  }

  equals(value: ReactionIntegration): boolean {
    return this.id.equals(value.id);
  }
}
