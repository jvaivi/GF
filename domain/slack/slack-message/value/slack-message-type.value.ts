import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackMessageType extends PrimitiveValueObject<string> {
  static create(value: string): SlackMessageType {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackMessageType(value);
  }
}
