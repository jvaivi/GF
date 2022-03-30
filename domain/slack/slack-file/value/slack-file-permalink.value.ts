import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackFilePermalink extends PrimitiveValueObject<string> {
  static create(value: string): SlackFilePermalink {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackFilePermalink(value);
  }
}
