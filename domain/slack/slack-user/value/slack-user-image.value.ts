import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class SlackUserImage extends PrimitiveValueObject<string> {
  static create(value: string): SlackUserImage {
    return new SlackUserImage(value || null);
  }
}
