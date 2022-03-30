import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackReactionTs extends PrimitiveValueObject<string> {
  static create(value: string): SlackReactionTs {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackReactionTs(value);
  }
}
