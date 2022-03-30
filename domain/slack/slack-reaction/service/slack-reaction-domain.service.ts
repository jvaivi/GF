import { concat, Observable, of } from 'rxjs';
import { count, map, mergeMap, take, tap } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { SlackMessageId } from '../../slack-message';
import { SlackUserId } from '../../slack-user/value';
import { SlackReactionDto } from '../dto/slack-reaction.dto';
import { SlackReaction } from '../entity/slack-reaction.entity';
import { SlackReactionAlreadyExistsError } from '../exception/slack-reaction-already-exists.exception';
import { SlackReactionNotFoundError } from '../exception/slack-reaction-notfound.exception';
import { ISlackReactionRepository } from '../repository';
import { SlackReactionId, SlackReactionTs, SlackReactionType } from '../value';

export class SlackReactionDomainService {
  constructor(private readonly slackReactionRepository: ISlackReactionRepository) {}

  insertSlackReaction(userId: string, messageId: string, type: string, ts: string): Observable<SlackReactionDto> {
    return concat(
      this.slackReactionRepository.selectAll(
        new FirestoreQueryBuilder<SlackReaction>().equalWhere('userId', userId).equalWhere('messageId', messageId).equalWhere('type', type)
      ),
      of(null)
    ).pipe(
      take(1),
      tap(slackMessage => {
        if (slackMessage !== null) {
          throw new SlackReactionAlreadyExistsError('this reaction aleady exists');
        }
      }),
      map(_ => {
        const slackReaction = new SlackReaction(this.slackReactionRepository.generateId());
        slackReaction.userId = SlackUserId.create(userId);
        slackReaction.messageId = SlackMessageId.create(messageId);
        slackReaction.type = SlackReactionType.create(type);
        slackReaction.ts = SlackReactionTs.create(ts);
        slackReaction.createdAt = Timestamp.createByMillsec(Date.now());
        slackReaction.updatedAt = Timestamp.createByMillsec(Date.now());
        return slackReaction;
      }),
      mergeMap(slackMessage => this.slackReactionRepository.insert(slackMessage)),
      map(item => this.convertDto(item))
    );
  }

  selectSlackReactionByUserIdAndMessageIdAndType(userId: string, messageId: string, type: string) {
    return concat(
      this.slackReactionRepository.selectAll(
        new FirestoreQueryBuilder<SlackReaction>().equalWhere('userId', userId).equalWhere('messageId', messageId).equalWhere('type', type)
      ),
      of(null)
    ).pipe(
      take(1),
      tap(slackMessage => {
        if (slackMessage === null) {
          throw new SlackReactionNotFoundError('this slack reaction is not found');
        }
      }),
      map(item => this.convertDto(item))
    );
  }

  countOfSlackReactionByMessageIdAndReactionType(messageId: string, type: string) {
    return this.slackReactionRepository
      .selectAll(new FirestoreQueryBuilder<SlackReaction>().equalWhere('messageId', messageId).equalWhere('type', type))
      .pipe(count());
  }

  selectAllSlackReactionByMessageIdAndReactionType(messageId: string, type: string) {
    return this.slackReactionRepository
      .selectAll(new FirestoreQueryBuilder<SlackReaction>().equalWhere('messageId', messageId).equalWhere('type', type))
      .pipe(map(item => this.convertDto(item)));
  }

  updateSlacReaction(slackReactionDto: SlackReactionDto) {
    const slackReaction = new SlackReaction(SlackReactionId.create(slackReactionDto.id));
    slackReaction.userId = SlackUserId.create(slackReactionDto.userId);
    slackReaction.messageId = SlackMessageId.create(slackReactionDto.messageId);
    slackReaction.type = SlackReactionType.create(slackReactionDto.type);
    slackReaction.ts = SlackReactionTs.create(slackReactionDto.ts);
    slackReaction.createdAt = Timestamp.createByDate(slackReactionDto.createdAt);
    slackReaction.updatedAt = Timestamp.createByMillsec(Date.now());
    return this.slackReactionRepository.update(slackReaction).pipe(map(item => this.convertDto(item)));
  }

  deleteSlackReaction(slackMessageId: string) {
    return this.slackReactionRepository.delete(SlackMessageId.create(slackMessageId));
  }

  private convertDto(slackReaction: SlackReaction): SlackReactionDto {
    return SlackReaction.allFields.reduce((p, key) => {
      if (slackReaction[key] === undefined) {
        return p;
      }
      const value = slackReaction[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as SlackReactionDto);
  }
}
