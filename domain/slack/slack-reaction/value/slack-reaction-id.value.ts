import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class SlackReactionId extends IdValueObject {
  static create(value: string): SlackReactionId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackReactionId(value);
  }
}
