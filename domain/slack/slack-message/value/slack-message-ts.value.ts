import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackMessageTs extends PrimitiveValueObject<string> {
  static create(value: string): SlackMessageTs {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackMessageTs(value);
  }
}
