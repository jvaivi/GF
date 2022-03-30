import { ETargetType } from '..';

export interface KnowledgeIntegrationDto {
  id: string;
  knowledgeId: string;
  targetId: string;
  targetType: ETargetType;
  createdAt: Date;
  updatedAt: Date;
}
