import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackUserDisplayName extends PrimitiveValueObject<string> {
  static create(value: string): SlackUserDisplayName {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackUserDisplayName(value);
  }
}
