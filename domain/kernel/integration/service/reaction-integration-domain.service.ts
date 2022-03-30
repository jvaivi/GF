import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { ReactionId } from '../../reaction';
import { ReactionIntegrationDto } from '../dto/action-integration.dto';
import { ReactionIntegration } from '../entity';
import { EDataType, ETargetType } from '../enum';
import { IReactionIntegrationRepository } from '../repository';
import { DataType, TargetId, TargetType } from '../value';

export class ReactionIntegrationDomainService {
  constructor(private readonly reactionIntegrationRepository: IReactionIntegrationRepository) {}

  selectReactionIntegrationByTargetId(targetId: string) {
    return this.reactionIntegrationRepository
      .selectAll(new FirestoreQueryBuilder<ReactionIntegration>().equalWhere('targetId', targetId))
      .pipe(
        take(1),
        map(item => this.convertDto(item))
      );
  }

  insertReactionIntegration(
    reactionId: string,
    targetId: string,
    dataType: EDataType,
    targetType: ETargetType
  ): Observable<ReactionIntegrationDto> {
    const reactionIntegration = new ReactionIntegration(this.reactionIntegrationRepository.generateId());
    reactionIntegration.reactionId = ReactionId.create(reactionId);
    reactionIntegration.targetId = TargetId.create(targetId);
    reactionIntegration.targetType = TargetType.create(targetType);
    reactionIntegration.dataType = DataType.create(dataType);
    reactionIntegration.createdAt = Timestamp.createByMillsec(Date.now());
    reactionIntegration.updatedAt = Timestamp.createByMillsec(Date.now());
    return this.reactionIntegrationRepository.insert(reactionIntegration).pipe(map(item => this.convertDto(item)));
  }

  deleteAllReactionIntegrationByTargetId(targetId: string) {
    return this.reactionIntegrationRepository
      .selectAll(new FirestoreQueryBuilder<ReactionIntegration>().equalWhere('targetId', targetId))
      .pipe(mergeMap(reactionIntegration => this.reactionIntegrationRepository.delete(reactionIntegration.id)));
  }

  private convertDto(reactionIntegration: ReactionIntegration): ReactionIntegrationDto {
    return ReactionIntegration.allFields.reduce((p, key) => {
      if (reactionIntegration[key] === undefined) {
        return p;
      }
      const value = reactionIntegration[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as ReactionIntegrationDto);
  }
}
