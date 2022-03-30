import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackReactionType extends PrimitiveValueObject<string> {
  static create(value: string): SlackReactionType {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackReactionType(value);
  }
}
