import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class AccessToken extends PrimitiveValueObject<string> {
  static create(value: string): AccessToken {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new AccessToken(value);
  }
}
