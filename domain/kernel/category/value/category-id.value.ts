import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class CategoryId extends IdValueObject {
  static create(value: string): CategoryId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new CategoryId(value);
  }
}
