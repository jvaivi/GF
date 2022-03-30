import { EDataType, ETargetType } from '../enum';

export interface ReactionIntegrationDto {
  id: string;
  actionId: string;
  targetId: string;
  dataType: EDataType;
  targetType: ETargetType;
  createdAt: Date;
  updatedAt: Date;
}
