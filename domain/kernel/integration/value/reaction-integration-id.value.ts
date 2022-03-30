import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class ReactionIntegrationId extends IdValueObject {
  static create(value: string): ReactionIntegrationId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new ReactionIntegrationId(value);
  }
}
