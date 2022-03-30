import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountId } from '../../../kernel/account';
import {
  OrganizationDisplayName,
  OrganizationEmail,
  OrganizationId,
  OrganizationImg,
  OrganizationName,
  OrganizationShortImg
} from '../value';

export class Organization implements Entity {
  @Column()
  readonly id: OrganizationId;
  @Column()
  createdBy: AccountId;
  @Column()
  email: OrganizationEmail;
  @Column()
  displayName: OrganizationDisplayName;
  @Column()
  name: OrganizationName;
  @Column()
  img: OrganizationImg;
  @Column()
  shortImg: OrganizationShortImg;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: OrganizationId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof Organization)[] {
    return getColumns(new Organization(OrganizationId.create('')));
  }

  equals(value: Organization): boolean {
    return this.id.equals(value.id);
  }
}
