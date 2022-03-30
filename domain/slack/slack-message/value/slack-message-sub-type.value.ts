import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackMessageSubType extends PrimitiveValueObject<string> {
  static create(value: string): SlackMessageSubType {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackMessageSubType(value);
  }
}
