import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { SlackMessageId } from '../../../slack-message';
import { SlackUserId } from '../../../slack-user/value';
import { SlackReaction } from '../../entity/slack-reaction.entity';
import { SlackReactionNotFoundError } from '../../exception/slack-reaction-notfound.exception';
import { SlackReactionId, SlackReactionTs, SlackReactionType } from '../../value';
import { ISlackReactionRepository } from '../slack-reaction.repository';

export class SlackReactionFirestoreRepository implements ISlackReactionRepository {
  private static readonly collectionId = 'slack_reaction';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: SlackReactionId): Observable<SlackReaction> {
    return this.firestoreService.getDocument(SlackReactionFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new SlackReactionNotFoundError('slack reaction is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  selectAll(builder: FirestoreQueryBuilder<SlackReaction>): Observable<SlackReaction> {
    return this.firestoreService.getCollection(SlackReactionFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(SlackReactionFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  insert(item: SlackReaction): Observable<SlackReaction> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(SlackReactionFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(reaction: SlackReaction): Observable<SlackReaction> {
    const currentMillsecUnixTimestap = +new Date();
    reaction.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(SlackReactionFirestoreRepository.collectionId, reaction.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new SlackReactionNotFoundError('slack reaction is not found');
        }
        return this.firestoreService.setDocument(SlackReactionFirestoreRepository.collectionId, this.convertToMap(reaction));
      }),
      map(_ => reaction)
    );
  }

  delete(id: SlackReactionId): Observable<void> {
    return this.firestoreService.deleteDocument(SlackReactionFirestoreRepository.collectionId, id);
  }

  generateId(): SlackReactionId {
    return SlackReactionId.create(this.firestoreService.generateId());
  }

  private convertToMap(reaction: SlackReaction): object {
    return SlackReaction.allFields.reduce((p, key) => {
      if (reaction[key] === undefined) {
        return p;
      }
      const value = reaction[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const slackReaction = new SlackReaction(SlackReactionId.create(item.id));
    slackReaction.userId = SlackUserId.create(item.userId);
    slackReaction.messageId = SlackMessageId.create(item.messageId);
    slackReaction.type = SlackReactionType.create(item.type);
    slackReaction.ts = SlackReactionTs.create(item.ts);
    slackReaction.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    slackReaction.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return slackReaction;
  }
}
