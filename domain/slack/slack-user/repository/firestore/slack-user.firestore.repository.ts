import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { SlackUser } from '../../entity/slack-user.entity';
import { SlackUserNotFoundError } from '../../exception/slack-user-notfound.exception';
import { SlackTeamId, SlackUserDisplayName, SlackUserId, SlackUserImage, SlackUserName } from '../../value';
import { ISlackUserRepository } from '../slack-user.repository';

export class SlackUserFirestoreRepository implements ISlackUserRepository {
  private static readonly collectionId = 'slack_user';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: SlackUserId): Observable<SlackUser> {
    return this.firestoreService.getDocument(SlackUserFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new SlackUserNotFoundError('slack user is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  selectAll(builder: FirestoreQueryBuilder<SlackUser>): Observable<SlackUser> {
    return this.firestoreService.getCollection(SlackUserFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(SlackUserFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  insert(item: SlackUser): Observable<SlackUser> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(SlackUserFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(user: SlackUser): Observable<SlackUser> {
    const currentMillsecUnixTimestap = +new Date();
    user.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(SlackUserFirestoreRepository.collectionId, user.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new SlackUserNotFoundError('slack user is not found');
        }
        return this.firestoreService.setDocument(SlackUserFirestoreRepository.collectionId, this.convertToMap(user));
      }),
      map(_ => user)
    );
  }

  delete(id: SlackUserId): Observable<void> {
    return this.firestoreService.deleteDocument(SlackUserFirestoreRepository.collectionId, id);
  }

  generateId(): SlackUserId {
    return SlackUserId.create(this.firestoreService.generateId());
  }

  private convertToMap(user: SlackUser): object {
    return SlackUser.allFields.reduce((p, key) => {
      if (key === 'name') {
        p[key] = Object.keys(user.name.value).reduce((pp, c) => {
          pp[c] = user.name.value[c] || '';
          return pp;
        }, {});
        console.log(p[key]);
        return p;
      }
      if (user[key] === undefined) {
        return p;
      }
      const value = user[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const slackUser = new SlackUser(SlackUserId.create(item.id));
    slackUser.teamId = SlackTeamId.create(item.teamId);
    slackUser.name = SlackUserName.create(item.name);
    slackUser.displayName = SlackUserDisplayName.create(item.displayName);
    slackUser.image = SlackUserImage.create(item.image);
    slackUser.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    slackUser.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return slackUser;
  }
}
