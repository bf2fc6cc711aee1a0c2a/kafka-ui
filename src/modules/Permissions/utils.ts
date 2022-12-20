import { ResourceOperationValue } from '@rhoas/app-services-ui-components/types/src/Kafka/ManageKafkaPermissions/components/ResourceOperation';
import { ResourceTypeValue } from '@rhoas/app-services-ui-components/types/src/Kafka/ManageKafkaPermissions/components/ResourceType';
import { AclResourceType } from '@rhoas/kafka-instance-sdk';
import { sentenceCase } from 'sentence-case';

export const displayName = (resourceType: AclResourceType): string => {
  switch (resourceType) {
    case AclResourceType.Group:
      return 'Consumer group';

    case AclResourceType.Topic:
      return 'Topic';

    case AclResourceType.Cluster:
      return 'Kafka instance';

    case AclResourceType.TransactionalId:
      return 'Transactional ID';

    default:
      return sentenceCase(resourceType);
  }
};

export const transformResourceType = (value: ResourceTypeValue | undefined) => {
  switch (value) {
    case 'consumer-group':
      return AclResourceType.Group;
    case 'kafka-instance':
      return AclResourceType.Cluster;
    case 'topic':
      return AclResourceType.Topic;
    default:
      return AclResourceType.TransactionalId;
  }
};
export const transformResourceOperation = (
  value: ResourceOperationValue | undefined
) => {
  switch (value) {
    case 'All':
      return 'ALL';
    case 'Alter':
      return 'ALTER';
    case 'Alter configs':
      return 'ALTER_CONFIGS';
    case 'Create':
      return 'CREATE';
    case 'Delete':
      return 'DELETE';
    case 'Describe':
      return 'DESCRIBE';
    case 'Describe configs':
      return 'DESCRIBE_CONFIGS';
    case 'Read':
      return 'READ';
    default:
      return 'WRITE';
  }
};
