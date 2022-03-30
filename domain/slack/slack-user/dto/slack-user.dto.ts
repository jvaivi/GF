import { SlackUserNameProps } from '../props/slack-user-name.props';

export interface SlackUserDto {
  id: string;
  teamId: string;
  name: SlackUserNameProps;
  displayName: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
