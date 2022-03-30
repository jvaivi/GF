import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class OrganizationName extends PrimitiveValueObject<string> {
  static create(value: string): OrganizationName {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new OrganizationName(value);
  }
}
