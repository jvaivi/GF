import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class IntegrationId extends IdValueObject {
  static create(value: string): IntegrationId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new IntegrationId(value);
  }
}
