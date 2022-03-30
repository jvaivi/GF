import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { KnowledgeId } from '../../knowledge';
import { KnowledgeIntegrationDto } from '../dto/knowledge-integration.dto';
import { KnowledgeIntegration } from '../entity/knowledge-integration.entity';
import { ETargetType } from '../enum';
import { IKnowledgeIntegrationRepository } from '../repository';
import { TargetId, TargetType } from '../value';

export class KnowledgeIntegrationDomainService {
  constructor(private readonly knowledgeIntegrationRepository: IKnowledgeIntegrationRepository) {}

  selectKnowledgeIntegrationByTargetId(targetId: string) {
    return this.knowledgeIntegrationRepository
      .selectAll(new FirestoreQueryBuilder<KnowledgeIntegration>().equalWhere('targetId', targetId))
      .pipe(
        take(1),
        map(item => this.convertDto(item))
      );
  }

  selectKnowledgeIntegrationByKnowledgeId(knowledgeId: string) {
    return this.knowledgeIntegrationRepository
      .selectAll(new FirestoreQueryBuilder<KnowledgeIntegration>().equalWhere('knowledgeId', knowledgeId))
      .pipe(
        take(1),
        map(item => this.convertDto(item))
      );
  }

  insertKnowledgeIntegration(knowledgeId: string, targetId: string, targetType: ETargetType): Observable<KnowledgeIntegrationDto> {
    const knowledgeIntegration = new KnowledgeIntegration(this.knowledgeIntegrationRepository.generateId());
    knowledgeIntegration.knowledgeId = KnowledgeId.create(knowledgeId);
    knowledgeIntegration.targetId = TargetId.create(targetId);
    knowledgeIntegration.targetType = TargetType.create(targetType);
    knowledgeIntegration.createdAt = Timestamp.createByMillsec(Date.now());
    knowledgeIntegration.updatedAt = Timestamp.createByMillsec(Date.now());
    return this.knowledgeIntegrationRepository.insert(knowledgeIntegration).pipe(map(item => this.convertDto(item)));
  }

  deleteAllKnowledgeIntegrationByTargetId(targetId: string) {
    return this.knowledgeIntegrationRepository
      .selectAll(new FirestoreQueryBuilder<KnowledgeIntegration>().equalWhere('targetId', targetId))
      .pipe(mergeMap(knowledgeIntegration => this.knowledgeIntegrationRepository.delete(knowledgeIntegration.id)));
  }

  private convertDto(knowledgeIntegration: KnowledgeIntegration): KnowledgeIntegrationDto {
    return KnowledgeIntegration.allFields.reduce((p, key) => {
      if (knowledgeIntegration[key] === undefined) {
        return p;
      }
      const value = knowledgeIntegration[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as KnowledgeIntegrationDto);
  }
}
