export interface SlackMessageDto {
  id: string;
  channelId: string;
  userId: string;
  registeredBy: string;
  ts: string;
  type: string;
  subtype: string;
  text: string;
  permalink: string;
  createdAt: Date;
  updatedAt: Date;
}
