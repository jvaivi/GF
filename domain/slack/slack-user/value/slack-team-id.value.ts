import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class SlackTeamId extends IdValueObject {
  static create(value: string): SlackTeamId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new SlackTeamId(value);
  }
}
