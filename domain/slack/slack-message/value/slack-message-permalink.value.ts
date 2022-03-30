import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackMessagePermalink extends PrimitiveValueObject<string> {
  static create(value: string): SlackMessagePermalink {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackMessagePermalink(value);
  }
}
