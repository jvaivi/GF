// tslint:disable: variable-name
import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountId } from '../../account';
import { OrganizationId } from '../../organization/value';
import { CategoryDescription, CategoryId, CategoryLabel } from '../value';

export class Category implements Entity {
  @Column()
  readonly id: CategoryId;
  @Column()
  organizationId: OrganizationId;
  @Column()
  createdBy: AccountId;
  @Column()
  label: CategoryLabel;
  @Column()
  description: CategoryDescription;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: CategoryId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof Category)[] {
    return getColumns(new Category(CategoryId.create('')));
  }

  equals(value: Category): boolean {
    return this.id.equals(value.id);
  }
}
