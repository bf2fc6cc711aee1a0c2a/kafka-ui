import React, { useContext, useEffect, useState } from 'react';
import { usePermissionsService } from '@app/services/acls';
import { PermissionsTable } from '@app/modules/Permissions/components/PermissionsTable';
import { ConfigContext } from '@app/contexts';
import { getConsumerGroups, getTopics } from '@app/services';
import { Topic } from '@rhoas/kafka-instance-sdk';

export type PermissionsTableViewProps = {
  kafkaName?: string;
};
export const PermissionsTableView: React.FunctionComponent<
  PermissionsTableViewProps
> = ({ kafkaName }) => {
  const config = useContext(ConfigContext);

  const permissionsService = usePermissionsService(config);
  const [topicNames, setTopicNames] = useState<string[]>([]);
  const [consumerGroupIds, setConsumerGroupNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchTopicNames = async () => {
      const response = await getTopics(config);
      const topicNames = response.items?.map(
        (topic: Topic) => topic.name || ''
      );
      setTopicNames(topicNames || []);
    };
    fetchTopicNames();
  }, [config]);

  useEffect(() => {
    const fetchConsumerGroupNames = async () => {
      const response = await getConsumerGroups(config);
      const consumerGroupNames = response.groups?.map(
        (consumerGroup) => consumerGroup.consumerGroupId || ''
      );
      setConsumerGroupNames(consumerGroupNames || []);
    };
    fetchConsumerGroupNames();
  }, [config]);

  //const permissionsService = createMockPermissionsService();

  return (
    <PermissionsTable
      permissionsService={permissionsService}
      kafkaName={kafkaName}
      topicNames={topicNames}
      consumerGroupIds={consumerGroupIds}
    />
  );
};

export default PermissionsTableView;
