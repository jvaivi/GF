import { concat, Observable, of } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../lib/gcp/builder/firestore-query.builder';
import { Timestamp } from '../../../../utility/model/timestamp.value';
import { AccountId } from '../../account/value';
import { OrganizationDto } from '../dto/organization.dto';
import { Organization } from '../entity/organization.entity';
import { OrganizationAlreadyExistsError } from '../exception/organization-already-exists.exception';
import { OrganizationNotFoundError } from '../exception/organization-notfound.exception';
import { IOrganizationRepository } from '../repository/organization.repository';
import {
  OrganizationDisplayName,
  OrganizationEmail,
  OrganizationId,
  OrganizationImg,
  OrganizationName,
  OrganizationShortImg
} from '../value';

export class OrganizationDomainService {
  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  selectOrganization(organizationId: string): Observable<OrganizationDto> {
    return this.organizationRepository.select(OrganizationId.create(organizationId)).pipe(map(item => this.convertDto(item)));
  }

  selectByName(name: string): Observable<OrganizationDto> {
    return concat(
      this.organizationRepository.selectAll(new FirestoreQueryBuilder<Organization>().equalWhere('name', name)),
      of(null as Organization)
    ).pipe(
      take(1),
      tap(item => {
        if (item === null) {
          throw new OrganizationNotFoundError('organization is not found');
        }
      }),
      map(item => this.convertDto(item))
    );
  }

  insertOrganization(accountId: string, email: string, displayName: string, name: string, img: string, shortImg: string) {
    return concat(
      this.organizationRepository.selectAll(new FirestoreQueryBuilder<Organization>().equalWhere('name', name)),
      of(null as Organization)
    ).pipe(
      take(1),
      tap(item => {
        if (item !== null) {
          throw new OrganizationAlreadyExistsError('this organization name is already exists', item.name.value);
        }
      }),
      map(_ => {
        const organization = new Organization(this.organizationRepository.generateId());
        organization.createdBy = AccountId.create(accountId);
        organization.email = OrganizationEmail.create(email);
        organization.displayName = OrganizationDisplayName.create(displayName);
        organization.name = OrganizationName.create(name);
        organization.img = OrganizationImg.create(img);
        organization.shortImg = OrganizationShortImg.create(shortImg);
        organization.createdAt = Timestamp.createByMillsec(Date.now());
        organization.updatedAt = Timestamp.createByMillsec(Date.now());
        return organization;
      }),
      mergeMap(organization => this.organizationRepository.insert(organization).pipe(map(item => this.convertDto(item))))
    );
  }

  update(organization: OrganizationDto) {
    return this.organizationRepository.select(OrganizationId.create(organization.id)).pipe(
      take(1),
      map(currentOrganization => {
        currentOrganization.createdBy = AccountId.create(organization.createdBy);
        currentOrganization.email = OrganizationEmail.create(organization.email);
        currentOrganization.displayName = OrganizationDisplayName.create(organization.displayName);
        //Todo: Name check
        currentOrganization.name = OrganizationName.create(organization.name);
        currentOrganization.img = OrganizationImg.create(organization.img);
        currentOrganization.shortImg = OrganizationShortImg.create(organization.shortImg);
        return currentOrganization;
      }),
      mergeMap(organization => this.organizationRepository.update(organization).pipe(map(item => this.convertDto(item))))
    );
  }

  private convertDto(organization: Organization): OrganizationDto {
    return Organization.allFields.reduce((p, key) => {
      if (organization[key] === undefined) {
        return p;
      }
      const value = organization[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {} as OrganizationDto);
  }
}
