export class SlackMessageAlreadyExistsError extends Error {
  constructor(message: string, readonly messageId: string) {
    super(message);
  }
}
