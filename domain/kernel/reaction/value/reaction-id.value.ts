import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class ReactionId extends IdValueObject {
  static create(value: string): ReactionId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new ReactionId(value);
  }
}
