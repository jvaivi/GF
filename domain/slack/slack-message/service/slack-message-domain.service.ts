import { concat, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackChannelId } from '../../slack-channel/value';
import { SlackUserId } from '../../slack-user/value';
import { SlackMessageDto } from '../dto/slack-message.dto';
import { SlackMessage } from '../entity';
import { SlackMessageAlreadyExistsError } from '../exception/slack-message-already-exists.exception';
import { SlackMessageNotFoundError } from '../exception/slack-message-notfound.exception';
import { ISlackMessageRepository } from '../repository';
import { SlackMessageId, SlackMessagePermalink, SlackMessageSubType, SlackMessageText, SlackMessageTs, SlackMessageType } from '../value';

export class SlackMessageDomainService {
  constructor(private readonly slackMessageRepository: ISlackMessageRepository) {}

  generateSlackMessageId(): string {
    return this.slackMessageRepository.generateId().value;
  }

  select(id: string) {
    return this.slackMessageRepository.select(SlackMessageId.create(id)).pipe(map(item => this.convertDto(item)));
  }

  insertSlackMessage(
    id: string,
    channelId: string,
    userId: string,
    registeredBy: string,
    ts: string,
    type: string,
    subtype: string,
    text: string,
    permalink: string
  ): Observable<SlackMessageDto> {
    return concat(
      this.slackMessageRepository.selectAll(
        new FirestoreQueryBuilder<SlackMessage>().equalWhere('channelId', channelId).equalWhere('userId', userId).equalWhere('ts', ts)
      ),
      this.slackMessageRepository.select(SlackMessageId.create(id)).pipe(
        take(1),
        catchError(_ => EMPTY)
      ),
      of(null)
    ).pipe(
      take(1),
      tap(slackMessage => {
        if (slackMessage !== null) {
          throw new SlackMessageAlreadyExistsError('this message aleady exists', (slackMessage as SlackMessage).id.value);
        }
      }),
      map(_ => {
        const slackMessage = new SlackMessage(SlackMessageId.create(id));
        slackMessage.channelId = SlackChannelId.create(channelId);
        slackMessage.userId = SlackUserId.create(userId);
        slackMessage.registeredBy = SlackUserId.create(registeredBy);
        slackMessage.ts = SlackMessageTs.create(ts);
        slackMessage.type = SlackMessageType.create(type);
        slackMessage.subtype = SlackMessageSubType.create(subtype);
        slackMessage.text = SlackMessageText.create(text);
        slackMessage.permalink = SlackMessagePermalink.create(permalink);
        slackMessage.createdAt = Timestamp.createByMillsec(Date.now());
        slackMessage.updatedAt = Timestamp.createByMillsec(Date.now());
        return slackMessage;
      }),
      mergeMap(slackMessage => this.slackMessageRepository.insert(slackMessage)),
      map(item => this.convertDto(item))
    );
  }

  selectSlackMessageByOriginChannelIdAndOriginUserIdAndOriginTs(channelId: string, userId: string, ts: string) {
    return concat(
      this.slackMessageRepository.selectAll(
        new FirestoreQueryBuilder<SlackMessage>().equalWhere('channelId', channelId).equalWhere('userId', userId).equalWhere('ts', ts)
      ),
      of(null)
    ).pipe(
      take(1),
      tap(slackMessage => {
        if (slackMessage === null) {
          throw new SlackMessageNotFoundError('message is not found');
        }
      }),
      map(item => this.convertDto(item))
    );
  }

  selectSlackMessageByTs(ts: string) {
    return concat(this.slackMessageRepository.selectAll(new FirestoreQueryBuilder<SlackMessage>().equalWhere('ts', ts)), of(null)).pipe(
      take(1),
      tap(slackMessage => {
        if (slackMessage === null) {
          throw new SlackMessageNotFoundError('message is not found');
        }
      }),
      map(item => this.convertDto(item))
    );
  }

  selectAll() {
    return this.slackMessageRepository.selectAll(new FirestoreQueryBuilder<SlackMessage>()).pipe(map(item => this.convertDto(item)));
  }

  updateSlackMessage(slackMessageDto: SlackMessageDto) {
    const slackMessage = new SlackMessage(SlackMessageId.create(slackMessageDto.id));
    slackMessage.channelId = SlackChannelId.create(slackMessageDto.channelId);
    slackMessage.userId = SlackUserId.create(slackMessageDto.userId);
    slackMessage.registeredBy = SlackUserId.create(slackMessageDto.registeredBy);
    slackMessage.ts = SlackMessageTs.create(slackMessageDto.ts);
    slackMessage.type = SlackMessageType.create(slackMessageDto.type);
    slackMessage.subtype = SlackMessageSubType.create(slackMessageDto.subtype);
    slackMessage.text = SlackMessageText.create(slackMessageDto.text);
    slackMessage.permalink = SlackMessagePermalink.create(slackMessageDto.permalink);
    slackMessage.createdAt = Timestamp.createByDate(slackMessageDto.createdAt);
    slackMessage.updatedAt = Timestamp.createByMillsec(Date.now());
    return this.slackMessageRepository.update(slackMessage).pipe(map(item => this.convertDto(item)));
  }

  deleteSlackMessage(slackMessageId: string) {
    return this.slackMessageRepository.delete(SlackMessageId.create(slackMessageId));
  }

  private convertDto(slackMessage: SlackMessage): SlackMessageDto {
    return SlackMessage.allFields.reduce((p, key) => {
      if (slackMessage[key] === undefined) {
        return p;
      }
      const value = slackMessage[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as SlackMessageDto);
  }
}
