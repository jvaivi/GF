import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackFileSize extends PrimitiveValueObject<number> {
  static create(value: number): SlackFileSize {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackFileSize(value);
  }
}
