import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class SlackUserId extends IdValueObject {
  static create(value: string): SlackUserId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackUserId(value);
  }
}
