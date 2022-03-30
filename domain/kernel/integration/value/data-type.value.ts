import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';
import { EDataType } from '../enum';

export class DataType extends PrimitiveValueObject<EDataType> {
  static create(value: EDataType): DataType {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new DataType(value);
  }
}
