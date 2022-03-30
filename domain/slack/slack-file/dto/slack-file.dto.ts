export interface SlackFileDto {
  id: string;
  slackMessageId: string;
  name: string;
  mimetype: string;
  type: string;
  size: number;
  downloadUrl: string;
  permalink: string;
  createdAt: Date;
  updatedAt: Date;
}
