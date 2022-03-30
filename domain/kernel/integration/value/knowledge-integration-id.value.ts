import { ArgumentNullException } from '../../../../utility/exception/argument-null.exception';
import { IdValueObject } from '../../../../utility/model/id-value-object.model';

export class KnowledgeIntegrationId extends IdValueObject {
  static create(value: string): KnowledgeIntegrationId {
    if (value === null) {
      throw new ArgumentNullException();
    }
    return new KnowledgeIntegrationId(value);
  }
}
