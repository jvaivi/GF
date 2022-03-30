import { ETargetType } from '../enum';

export interface IntegrationDto {
  id: string;
  accountOrganizationId: string;
  targetId: string;
  targetType: ETargetType;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
}
