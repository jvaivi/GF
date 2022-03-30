import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackMessageText extends PrimitiveValueObject<string> {
  static create(value: string): SlackMessageText {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackMessageText(value);
  }
}
