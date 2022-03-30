import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class SlackFileId extends IdValueObject {
  static create(value: string): SlackFileId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackFileId(value);
  }
}
