import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackFileName extends PrimitiveValueObject<string> {
  static create(value: string): SlackFileName {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackFileName(value);
  }
}
