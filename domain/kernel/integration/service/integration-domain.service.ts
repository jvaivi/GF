import { concat, Observable, of } from 'rxjs';
import { map, mergeMap, take, tap, toArray } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountId } from '../../account';
import { AccountOrganizationId } from '../../account/value/account-organization-id.value';
import { IntegrationDto } from '../dto/integration.dto';
import { Integration } from '../entity';
import { ETargetType } from '../enum';
import { IntegrationArleadyExistsError } from '../exception/integration-already-exists.exception';
import { IntegrationNotFoundError } from '../exception/integration-notfound.exception';
import { IIntegrationRepository } from '../repository/integration.repository';
import { AccessToken, IntegrationId, TargetId, TargetType } from '../value';

export class IntegrationDomainService {
  constructor(private readonly integrationRepository: IIntegrationRepository) {}

  selectIntegration(integrationId: string) {
    return this.integrationRepository.select(IntegrationId.create(integrationId)).pipe(map(item => this.convertDto(item)));
  }

  selectAllByAccountOrganizationId(accountOrganizationId: string) {
    return this.integrationRepository
      .selectAll(new FirestoreQueryBuilder<Integration>().equalWhere('accountOrganizationId', accountOrganizationId))
      .pipe(map(item => this.convertDto(item)));
  }

  selectByTargetIdAndTargetType(targetId: string, targetType: ETargetType) {
    return concat(
      this.integrationRepository.selectAll(
        new FirestoreQueryBuilder<Integration>().equalWhere('targetId', targetId).equalWhere('targetType', targetType)
      ),
      of(null as Integration)
    ).pipe(
      take(1),
      tap(item => {
        if (item === null) {
          throw new IntegrationNotFoundError('Integration is not found');
        }
      }),
      map(item => this.convertDto(item))
    );
  }

  insertIntegration(
    accountOrganizationId: string,
    targetId: string,
    targetType: ETargetType,
    accessToken: string
  ): Observable<IntegrationDto> {
    // TODO: Search account organization
    return this.integrationRepository
      .selectAll(
        new FirestoreQueryBuilder<Integration>()
          .equalWhere('accountOrganizationId', accountOrganizationId)
          .equalWhere('targetType', targetType)
      )
      .pipe(
        toArray(),
        map(integrations => {
          if (integrations.length > 0) {
            throw new IntegrationArleadyExistsError();
          }
          const integration = new Integration(this.integrationRepository.generateId());
          integration.accountOrganizationId = AccountOrganizationId.create(accountOrganizationId);
          integration.targetId = TargetId.create(targetId);
          integration.targetType = TargetType.create(targetType);
          integration.accessToken = AccessToken.create(accessToken);
          integration.createdAt = Timestamp.createByMillsec(Date.now());
          integration.updatedAt = Timestamp.createByMillsec(Date.now());
          return integration;
        }),
        mergeMap(integration => this.integrationRepository.insert(integration).pipe(map(item => this.convertDto(item))))
      );
  }

  updateIntegration(integrationDto: IntegrationDto) {
    const integration = new Integration(IntegrationId.create(integrationDto.id));
    integration.accountOrganizationId = AccountId.create(integrationDto.accountOrganizationId);
    integration.targetId = TargetId.create(integrationDto.targetId);
    integration.targetType = TargetType.create(integrationDto.targetType);
    integration.accessToken = AccessToken.create(integrationDto.accessToken);
    integration.createdAt = Timestamp.createByMillsec(Date.now());
    integration.updatedAt = Timestamp.createByMillsec(Date.now());
    return this.integrationRepository.update(integration).pipe(map(item => this.convertDto(item)));
  }

  deleteIntegration(integrationId: string) {
    return this.integrationRepository.delete(IntegrationId.create(integrationId));
  }

  private convertDto(integration: Integration): IntegrationDto {
    return Integration.allFields.reduce((p, key) => {
      if (integration[key] === undefined) {
        return p;
      }
      const value = integration[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as IntegrationDto);
  }
}
