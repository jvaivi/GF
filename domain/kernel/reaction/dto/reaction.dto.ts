import { EReactionType } from '../enum/reaction-type.enum';

export interface ReactionDto {
  id: string;
  accountOrganizationId: string;
  type: EReactionType;
  createdAt: Date;
  updatedAt: Date;
}
