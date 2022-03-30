import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackFileType extends PrimitiveValueObject<string> {
  static create(value: string): SlackFileType {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackFileType(value);
  }
}
