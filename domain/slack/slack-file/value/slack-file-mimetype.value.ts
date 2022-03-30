import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackFileMimetype extends PrimitiveValueObject<string> {
  static create(value: string): SlackFileMimetype {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackFileMimetype(value);
  }
}
