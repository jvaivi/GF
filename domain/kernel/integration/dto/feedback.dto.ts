import { ETargetType } from '../enum';
import { EFeedbackStatus } from '../enum/feedback-status';

export interface FeedbackDto {
  id: string;
  knowledgeId: string;
  from: string;
  to: string;
  targetType: ETargetType;
  status: EFeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
}
