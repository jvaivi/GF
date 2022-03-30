import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class CategoryKnowledgeId extends IdValueObject {
  static create(value: string): CategoryKnowledgeId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new CategoryKnowledgeId(value);
  }
}
