// tslint:disable: variable-name
import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountOrganizationId } from '../../account/value/account-organization-id.value';
import { AccessToken, IntegrationId, TargetType } from '../value';
import { TargetId } from '../value/target-id.value';

export class Integration implements Entity {
  @Column()
  readonly id: IntegrationId;
  @Column()
  accessToken: AccessToken;
  @Column()
  accountOrganizationId: AccountOrganizationId;
  @Column()
  targetId: TargetId;
  @Column()
  targetType: TargetType;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: IntegrationId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof Integration)[] {
    return getColumns(new Integration(IntegrationId.create('')));
  }

  equals(value: Integration): boolean {
    return this.id.equals(value.id);
  }
}
