import { EMPTY } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from './../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackUserDto } from '../dto/slack-user.dto';
import { SlackUser } from '../entity/slack-user.entity';
import { SlackUserNotFoundError } from '../exception/slack-user-notfound.exception';
import { SlackUserNameProps } from '../props/slack-user-name.props';
import { ISlackUserRepository } from '../repository';
import { SlackTeamId, SlackUserDisplayName, SlackUserId, SlackUserImage, SlackUserName } from '../value';

export class SlackUserDomainService {
  constructor(private readonly slackUserRepository: ISlackUserRepository) {}

  selectUser(id: string) {
    return this.slackUserRepository.select(SlackUserId.create(id)).pipe(map(item => this.convertDto(item)));
  }

  selectAllUser(builder = new FirestoreQueryBuilder<SlackUser>()) {
    return this.slackUserRepository.selectAll(builder).pipe(map(item => this.convertDto(item)));
  }

  insertSlackUser(id: string, teamId: string, name: SlackUserNameProps, displayName: string, image: string) {
    return this.slackUserRepository.select(SlackUserId.create(id)).pipe(
      take(1),
      catchError(err => {
        if (err instanceof SlackUserNotFoundError) {
          const slackUser = new SlackUser(SlackUserId.create(id));
          slackUser.teamId = SlackTeamId.create(teamId);
          slackUser.name = SlackUserName.create(name);
          slackUser.displayName = SlackUserDisplayName.create(displayName);
          slackUser.image = SlackUserImage.create(image);
          slackUser.createdAt = Timestamp.createByMillsec(Date.now());
          slackUser.updatedAt = Timestamp.createByMillsec(Date.now());
          return this.slackUserRepository.insert(slackUser);
        } else {
          return EMPTY;
        }
      }),
      map(item => this.convertDto(item))
    );
  }

  private convertDto(slackFile: SlackUser): SlackUserDto {
    return SlackUser.allFields.reduce((p, key) => {
      if (slackFile[key] === undefined) {
        return p;
      }
      const value = slackFile[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as SlackUserDto);
  }
}
