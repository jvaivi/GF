import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackFileDownloadUrl extends PrimitiveValueObject<string> {
  static create(value: string): SlackFileDownloadUrl {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackFileDownloadUrl(value);
  }
}
