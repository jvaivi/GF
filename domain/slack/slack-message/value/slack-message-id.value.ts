import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class SlackMessageId extends IdValueObject {
  static create(value: string): SlackMessageId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackMessageId(value);
  }
}
