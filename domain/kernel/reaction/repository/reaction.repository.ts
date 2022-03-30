import { Reaction } from '../entity/reaction.entity';
import { IRepository } from '../../../../utility/repository/repository';
import { ReactionId } from '../value';

export abstract class IReactionRepository extends IRepository<ReactionId, Reaction> {}
