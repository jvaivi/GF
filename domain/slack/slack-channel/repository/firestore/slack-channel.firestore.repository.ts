import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { SlackChannel } from '../../entity/slack-channel.entity';
import { SlackChannelNotFoundError } from '../../exception/slack-channel-notfound.exception';
import { SlackChannelId, SlackChannelName } from '../../value';
import { ISlackChannelRepository } from '../slack-channel.repository';

export class SlackChannelFirestoreRepository implements ISlackChannelRepository {
  private static readonly collectionId = 'slack_channel';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: SlackChannelId): Observable<SlackChannel> {
    return this.firestoreService.getDocument(SlackChannelFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new SlackChannelNotFoundError('slack channel is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  selectAll(builder: FirestoreQueryBuilder<SlackChannel>): Observable<SlackChannel> {
    return this.firestoreService.getCollection(SlackChannelFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(SlackChannelFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  insert(item: SlackChannel): Observable<SlackChannel> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(SlackChannelFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(channel: SlackChannel): Observable<SlackChannel> {
    const currentMillsecUnixTimestap = +new Date();
    channel.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(SlackChannelFirestoreRepository.collectionId, channel.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new SlackChannelNotFoundError('slack channel is not found');
        }
        return this.firestoreService.setDocument(SlackChannelFirestoreRepository.collectionId, this.convertToMap(channel));
      }),
      map(_ => channel)
    );
  }

  delete(id: SlackChannelId): Observable<void> {
    return this.firestoreService.deleteDocument(SlackChannelFirestoreRepository.collectionId, id);
  }

  generateId(): SlackChannelId {
    return SlackChannelId.create(this.firestoreService.generateId());
  }

  private convertToMap(reaction: SlackChannel): object {
    return SlackChannel.allFields.reduce((p, key) => {
      if (reaction[key] === undefined) {
        return p;
      }
      const value = reaction[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const slackChannel = new SlackChannel(SlackChannelId.create(item.id));
    slackChannel.name = SlackChannelName.create(item.name);
    slackChannel.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    slackChannel.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return slackChannel;
  }
}
