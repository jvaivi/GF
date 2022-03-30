// tslint:disable: variable-name
import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountOrganizationId } from '../../account/value/account-organization-id.value';
import { ReactionId, ReactionType, TargetType } from '../value';

export class Reaction implements Entity {
  @Column()
  readonly id: ReactionId;
  @Column()
  reactedBy: AccountOrganizationId;
  @Column()
  type: ReactionType;
  @Column()
  target: TargetType;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: ReactionId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof Reaction)[] {
    return getColumns(new Reaction(ReactionId.create('')));
  }

  equals(value: Reaction): boolean {
    return this.id.equals(value.id);
  }
}
