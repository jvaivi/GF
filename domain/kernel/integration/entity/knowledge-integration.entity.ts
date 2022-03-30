import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { KnowledgeId } from '../../knowledge';
import { ReactionIntegrationId, TargetId, TargetType } from '../value';
import { KnowledgeIntegrationId } from '../value/knowledge-integration-id.value';

export class KnowledgeIntegration implements Entity {
  @Column()
  readonly id: KnowledgeIntegrationId;
  @Column()
  knowledgeId: KnowledgeId;
  @Column()
  targetId: TargetId;
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
  static get allFields(): (keyof KnowledgeIntegration)[] {
    return getColumns(new KnowledgeIntegration(KnowledgeIntegrationId.create('')));
  }

  equals(value: KnowledgeIntegration): boolean {
    return this.id.equals(value.id);
  }
}
