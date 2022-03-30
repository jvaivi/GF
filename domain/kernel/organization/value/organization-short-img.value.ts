import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class OrganizationShortImg extends PrimitiveValueObject<string> {
  static create(value: string): OrganizationShortImg {
    return new OrganizationShortImg(value);
  }
}
