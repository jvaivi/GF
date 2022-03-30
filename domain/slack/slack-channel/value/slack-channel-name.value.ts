import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackChannelName extends PrimitiveValueObject<string> {
  static create(value: string): SlackChannelName {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackChannelName(value);
  }
}
