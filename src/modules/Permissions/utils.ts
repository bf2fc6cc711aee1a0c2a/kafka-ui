import { ResourceOperationValue } from '@rhoas/app-services-ui-components/types/src/Kafka/ManageKafkaPermissions/components/ResourceOperation';
import { ResourceTypeValue } from '@rhoas/app-services-ui-components/types/src/Kafka/ManageKafkaPermissions/components/ResourceType';
import { AclResourceType } from '@rhoas/kafka-instance-sdk';

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
