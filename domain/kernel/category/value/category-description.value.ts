import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class CategoryDescription extends PrimitiveValueObject<string> {
  static create(value: string): CategoryDescription {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new CategoryDescription(value);
  }
}
