// tslint:disable: variable-name
import { KnowledgeId } from '../../knowledge';
import { Column, getColumns } from '../../../../utility/decorator/entity/column.decorator';
import { Entity } from '../../../../utility/model/entity.model';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { IntegrationId, TargetType } from '../value';
import { FeedbackId } from '../value/feedback-id.value';
import { FeedbackStatus } from '../value/feedback-status.value';

export class Feedback implements Entity {
  @Column()
  readonly id: FeedbackId;
  @Column()
  knowledgeId: KnowledgeId;
  @Column()
  from: IntegrationId;
  @Column()
  to: IntegrationId;
  @Column()
  targetType: TargetType;
  @Column()
  status: FeedbackStatus;
  @Column()
  createdAt: Timestamp;
  @Column()
  updatedAt: Timestamp;

  constructor(id: FeedbackId) {
    this.id = id;
  }

  // Dirty code
  static get allFields(): (keyof Feedback)[] {
    return getColumns(new Feedback(FeedbackId.create('')));
  }

  equals(value: Feedback): boolean {
    return this.id.equals(value.id);
  }
}
