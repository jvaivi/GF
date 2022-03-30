import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class CategoryLabel extends PrimitiveValueObject<string> {
  static create(value: string): CategoryLabel {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new CategoryLabel(value);
  }
}
