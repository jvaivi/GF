import { EMPTY } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackChannelDto } from '../dto/slack-channel.dto';
import { SlackChannel } from '../entity/slack-channel.entity';
import { SlackChannelNotFoundError } from '../exception/slack-channel-notfound.exception';
import { ISlackChannelRepository } from '../repository';
import { SlackChannelId, SlackChannelName } from '../value';

export class SlackChannelDomainService {
  constructor(private readonly slackChannelRepository: ISlackChannelRepository) {}

  selectChannel(id: string) {
    return this.slackChannelRepository.select(SlackChannelId.create(id)).pipe(map(item => this.convertDto(item)));
  }

  insertSlackChannel(id: string, name: string) {
    return this.slackChannelRepository.select(SlackChannelId.create(id)).pipe(
      take(1),
      catchError(err => {
        if (err instanceof SlackChannelNotFoundError) {
          const slackChannel = new SlackChannel(SlackChannelId.create(id));
          slackChannel.name = SlackChannelName.create(name);
          slackChannel.createdAt = Timestamp.createByMillsec(Date.now());
          slackChannel.updatedAt = Timestamp.createByMillsec(Date.now());
          return this.slackChannelRepository.insert(slackChannel);
        } else {
          return EMPTY;
        }
      }),
      map(item => this.convertDto(item))
    );
  }

  private convertDto(channel: SlackChannel): SlackChannelDto {
    return SlackChannel.allFields.reduce((p, key) => {
      if (channel[key] === undefined) {
        return p;
      }
      const value = channel[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as SlackChannelDto);
  }
}
