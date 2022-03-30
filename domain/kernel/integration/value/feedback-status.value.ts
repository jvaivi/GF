import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';
import { EFeedbackStatus } from '../enum/feedback-status';

export class FeedbackStatus extends PrimitiveValueObject<EFeedbackStatus> {
  static create(value: EFeedbackStatus): FeedbackStatus {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new FeedbackStatus(value);
  }
}
