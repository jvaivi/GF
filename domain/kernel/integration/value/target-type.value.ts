import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';
import { ETargetType } from '../enum/target-type.enum';

export class TargetType extends PrimitiveValueObject<ETargetType> {
  static create(value: ETargetType): TargetType {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new TargetType(value);
  }
}
