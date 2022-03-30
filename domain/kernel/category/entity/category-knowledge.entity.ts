import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountOrganizationId } from '../../account';
import { KnowledgeId } from '../../knowledge';
import { CategoryId, CategoryKnowledgeId } from '../value';

export class CategoryKnowledge implements Entity {
  @Column()
  readonly id: CategoryKnowledgeId;
  @Column()
  categoryId: CategoryId;
  @Column()
  knowledgeId: KnowledgeId;
  @Column()
  createdBy: AccountOrganizationId;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: CategoryKnowledgeId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof CategoryKnowledge)[] {
    return getColumns(new CategoryKnowledge(CategoryKnowledgeId.create('')));
  }

  equals(value: CategoryKnowledge): boolean {
    return this.id.equals(value.id);
  }
}
