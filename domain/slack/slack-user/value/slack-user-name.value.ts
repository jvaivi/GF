import { ValueObject } from '../../../../utility/model/value-object.model';
import { SlackUserNameProps } from '../props/slack-user-name.props';

export class SlackUserName extends ValueObject<SlackUserNameProps> {
  static create(props: SlackUserNameProps): SlackUserName {
    return new SlackUserName(props);
  }

  get first(): string {
    return this._value.first;
  }
  get last(): string {
    return this._value.first;
  }
}
