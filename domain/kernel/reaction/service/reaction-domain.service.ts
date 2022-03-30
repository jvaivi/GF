import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountOrganizationId } from '../../account/value/account-organization-id.value';
import { ReactionDto } from '../dto/reaction.dto';
import { Reaction } from '../entity';
import { EReactionType } from '../enum/reaction-type.enum';
import { IReactionRepository } from '../repository';
import { ReactionId, ReactionType } from '../value';

export class ReactionDomainService {
  constructor(private readonly reactionRepository: IReactionRepository) {}

  insertReaction(type: EReactionType, accountOrganizationId: string): Observable<ReactionDto> {
    const reaction = new Reaction(this.reactionRepository.generateId());
    reaction.reactedBy = AccountOrganizationId.create(accountOrganizationId);
    reaction.type = ReactionType.create(type);
    reaction.createdAt = Timestamp.createByMillsec(Date.now());
    reaction.updatedAt = Timestamp.createByMillsec(Date.now());
    return this.reactionRepository.insert(reaction).pipe(map(item => this.convertDto(item)));
  }

  updateReaction(reactionDto: ReactionDto) {
    const reaction = new Reaction(ReactionId.create(reactionDto.id));
    reaction.reactedBy = AccountOrganizationId.create(reactionDto.accountOrganizationId);
    reaction.type = ReactionType.create(reactionDto.type);
    reaction.createdAt = Timestamp.createByDate(reactionDto.createdAt);
    reaction.updatedAt = Timestamp.createByMillsec(Date.now());
    return this.reactionRepository.update(reaction).pipe(map(item => this.convertDto(item)));
  }

  deleteReaction(reactionId: string) {
    return this.reactionRepository.delete(ReactionId.create(reactionId));
  }

  private convertDto(reaction: Reaction): ReactionDto {
    return Reaction.allFields.reduce((p, key) => {
      if (reaction[key] === undefined) {
        return p;
      }
      const value = reaction[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as ReactionDto);
  }
}
