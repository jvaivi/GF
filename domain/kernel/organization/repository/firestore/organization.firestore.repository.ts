import { EMPTY, Observable } from 'rxjs';
import { distinct, expand, map, mergeMap, take } from 'rxjs/operators';
import { FirestoreQueryBuilder } from '../../../../../lib/gcp/builder/firestore-query.builder';
import { IFirestoreService } from '../../../../../lib/gcp/service/firestore.service';
import { Timestamp } from '../../../../../utility/model/timestamp.value';
import { AccountId } from '../../../account/value';
import { Organization } from '../../entity/organization.entity';
import { OrganizationNotFoundError } from '../../exception/organization-notfound.exception';
import {
  OrganizationDisplayName,
  OrganizationEmail,
  OrganizationId,
  OrganizationImg,
  OrganizationName,
  OrganizationShortImg
} from '../../value';
import { IOrganizationRepository } from '../organization.repository';

export class OrganizationFirestoreRepository implements IOrganizationRepository {
  private static readonly collectionId = 'organization';

  constructor(private readonly firestoreService: IFirestoreService) {}

  select(id: OrganizationId): Observable<Organization> {
    return this.firestoreService.getDocument(OrganizationFirestoreRepository.collectionId, id).pipe(
      map(item => {
        if (!item) {
          throw new OrganizationNotFoundError('organization is not found');
        }
        return this.convertToEntity(item);
      })
    );
  }

  selectAll(builder: FirestoreQueryBuilder<Organization>): Observable<Organization> {
    return this.firestoreService.getCollection(OrganizationFirestoreRepository.collectionId, builder).pipe(
      take(1),
      expand(items =>
        items.length
          ? this.firestoreService
              .getCollection(OrganizationFirestoreRepository.collectionId, builder.startAfter(items[items.length - 1].id).limit(100))
              .pipe(take(1))
          : EMPTY
      ),
      mergeMap(items => items),
      distinct(item => item.id),
      map(item => this.convertToEntity(item))
    );
  }

  insert(item: Organization): Observable<Organization> {
    item.createdAt = Timestamp.createByDate(new Date());
    return this.firestoreService.setDocument(OrganizationFirestoreRepository.collectionId, this.convertToMap(item)).pipe(map(() => item));
  }

  update(organization: Organization): Observable<Organization> {
    const currentMillsecUnixTimestap = +new Date();
    organization.updatedAt = Timestamp.createByMillsec(currentMillsecUnixTimestap);
    return this.firestoreService.getDocument(OrganizationFirestoreRepository.collectionId, organization.id).pipe(
      take(1),
      mergeMap(item => {
        if (!item) {
          throw new OrganizationNotFoundError('organization is not found');
        }
        return this.firestoreService.setDocument(OrganizationFirestoreRepository.collectionId, this.convertToMap(organization));
      }),
      map(_ => organization)
    );
  }

  delete(id: OrganizationId): Observable<void> {
    return this.firestoreService.deleteDocument(OrganizationFirestoreRepository.collectionId, id);
  }

  generateId(): OrganizationId {
    return OrganizationId.create(this.firestoreService.generateId());
  }

  private convertToMap(organization: Organization): object {
    return Organization.allFields.reduce((p, key) => {
      if (organization[key] === undefined) {
        return p;
      }
      const value = organization[key] as { value: any };
      p[key] = value.value;
      return p;
    }, {});
  }

  private convertToEntity(item: any) {
    const organization = new Organization(OrganizationId.create(item.id));
    organization.createdBy = AccountId.create(item.createdBy);
    organization.email = OrganizationEmail.create(item.email);
    organization.displayName = OrganizationDisplayName.create(item.displayName);
    organization.name = OrganizationName.create(item.name);
    organization.img = OrganizationImg.create(item.img);
    organization.shortImg = OrganizationShortImg.create(item.shortImg);
    organization.createdAt = Timestamp.createByMillsec(item.createdAt.seconds * 1000);
    organization.updatedAt = Timestamp.createByMillsec(item.updatedAt.seconds * 1000);
    return organization;
  }
}
