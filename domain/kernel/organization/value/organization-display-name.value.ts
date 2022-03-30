import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class OrganizationDisplayName extends PrimitiveValueObject<string> {
  static create(value: string): OrganizationDisplayName {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new OrganizationDisplayName(value);
  }
}
