import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';
import { EReactionType } from '../enum/reaction-type.enum';

export class ReactionType extends PrimitiveValueObject<EReactionType> {
  static create(value: EReactionType): ReactionType {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new ReactionType(value);
  }
}
