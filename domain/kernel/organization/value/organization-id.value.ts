import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class OrganizationId extends IdValueObject {
  static create(value: string): OrganizationId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new OrganizationId(value);
  }
}
