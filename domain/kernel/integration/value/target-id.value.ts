import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class TargetId extends IdValueObject {
  static create(value: string): TargetId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new TargetId(value);
  }
}
