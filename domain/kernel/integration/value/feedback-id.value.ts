import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class FeedbackId extends IdValueObject {
  static create(value: string): FeedbackId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new FeedbackId(value);
  }
}
