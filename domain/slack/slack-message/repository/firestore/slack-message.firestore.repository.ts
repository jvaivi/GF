import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { SlackChannelId } from '../../../slack-channel/value';
import { SlackUserId } from '../../../slack-user/value';
import { SlackMessage } from '../../entity/slack-message.entity';
import { SlackMessageNotFoundError } from '../../exception/slack-message-notfound.exception';
import {
  SlackMessageId,
  SlackMessagePermalink,
  SlackMessageSubType,
  SlackMessageText,
  SlackMessageTs,
  SlackMessageType
} from '../../value';
import { ISlackMessageRepository } from '../slack-message.repository';

export class SlackMessageFirestoreRepository implements ISlackMessageRepository {
  private static readonly collectionId = 'slack_message';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: SlackMessageId): Observable<SlackMessage> {
    return this.firestoreService.getDocument(SlackMessageFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new SlackMessageNotFoundError('slack message is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  selectAll(builder: FirestoreQueryBuilder<SlackMessage>): Observable<SlackMessage> {
    return this.firestoreService.getCollection(SlackMessageFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(SlackMessageFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  insert(item: SlackMessage): Observable<SlackMessage> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(SlackMessageFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(message: SlackMessage): Observable<SlackMessage> {
    const currentMillsecUnixTimestap = +new Date();
    message.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(SlackMessageFirestoreRepository.collectionId, message.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new SlackMessageNotFoundError('slack message is not found');
        }
        return this.firestoreService.setDocument(SlackMessageFirestoreRepository.collectionId, this.convertToMap(message));
      }),
      map(_ => message)
    );
  }

  delete(id: SlackMessageId): Observable<void> {
    return this.firestoreService.deleteDocument(SlackMessageFirestoreRepository.collectionId, id);
  }

  generateId(): SlackMessageId {
    return SlackMessageId.create(this.firestoreService.generateId());
  }

  private convertToMap(reaction: SlackMessage): object {
    return SlackMessage.allFields.reduce((p, key) => {
      if (reaction[key] === undefined) {
        return p;
      }
      const value = reaction[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const slackMessage = new SlackMessage(SlackMessageId.create(item.id));
    slackMessage.channelId = SlackChannelId.create(item.channelId);
    slackMessage.userId = SlackUserId.create(item.userId);
    slackMessage.registeredBy = SlackUserId.create(item.registeredBy);
    slackMessage.ts = SlackMessageTs.create(item.ts);
    slackMessage.type = SlackMessageType.create(item.type);
    slackMessage.subtype = SlackMessageSubType.create(item.subtype);
    slackMessage.text = SlackMessageText.create(item.text);
    slackMessage.permalink = SlackMessagePermalink.create(item.permalink);
    slackMessage.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    slackMessage.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return slackMessage;
  }
}
