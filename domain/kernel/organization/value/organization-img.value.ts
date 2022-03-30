import { PrimitiveValueObject } from '../../../../utility/model/primitive-value-object.model';

export class OrganizationImg extends PrimitiveValueObject<string> {
  static create(value: string): OrganizationImg {
    return new OrganizationImg(value);
  }
}
