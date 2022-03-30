import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class SlackChannelId extends IdValueObject {
  static create(value: string): SlackChannelId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackChannelId(value);
  }
}
