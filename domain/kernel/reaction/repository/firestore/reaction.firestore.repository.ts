import { IFirestoreService } from 'gcp/service/firestore.service';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { AccountOrganizationId } from '../../../account/value/account-organization-id.value';
import { Reaction } from '../../entity';
import { ReactionNotFoundError } from '../../exception/reaction-notfound.exception';
import { ReactionId, ReactionType } from '../../value';
import { IReactionRepository } from '../reaction.repository';

export class ReactionFirestoreRepository implements IReactionRepository {
  private static readonly collectionId = 'reaction';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: ReactionId): Observable<Reaction> {
    return this.firestoreService.getDocument(ReactionFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new ReactionNotFoundError('reaction is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  insert(item: Reaction): Observable<Reaction> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(ReactionFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(account: Reaction): Observable<Reaction> {
    const currentMillsecUnixTimestap = +new Date();
    account.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(ReactionFirestoreRepository.collectionId, account.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new ReactionNotFoundError('reaction is not found');
        }
        return this.firestoreService.setDocument(ReactionFirestoreRepository.collectionId, this.convertToMap(account));
      }),
      map(_ => account)
    );
  }

  delete(id: ReactionId): Observable<void> {
    return this.firestoreService.deleteDocument(ReactionFirestoreRepository.collectionId, id);
  }

  generateId(): ReactionId {
    return ReactionId.create(this.firestoreService.generateId());
  }

  private convertToMap(reaction: Reaction): object {
    return Reaction.allFields.reduce((p, key) => {
      if (reaction[key] === undefined) {
        return p;
      }
      const value = reaction[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const reaction = new Reaction(ReactionId.create(item.id));
    reaction.reactedBy = AccountOrganizationId.create(item.reactedBy);
    reaction.type = ReactionType.create(item.type);
    reaction.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    reaction.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return reaction;
  }
}
