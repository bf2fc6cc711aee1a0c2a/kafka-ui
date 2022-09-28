import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertVariant,
  useAlert,
  useBasename,
} from '@rhoas/app-services-ui-shared';
import { ConfigContext, useFederated } from '@app/contexts';
import { getTopic } from '@app/services';
import { CreateTopicPage, NewTopic } from '@rhoas/app-services-ui-components';
import {
  NewTopicInput,
  TopicsApi,
  Configuration,
} from '@rhoas/kafka-instance-sdk';
import { IAdvancedTopic, serializeTopic } from '../../utils';

export const CreateTopic: React.FC = () => {
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { kafkaName, kafkaPageLink, kafkaInstanceLink } = useFederated() || {};
  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();
  const {
    replicationFactor = 0,
    minInSyncReplicas = 0,
    isMultiAZ,
  } = useFederated() || {};

  const config = useContext(ConfigContext);

  const onCloseCreateTopic = () => {
    history.push(`${basename}/topics`);
  };
  const saveTopic = (topicData: NewTopic) => {
    const convertedTopicData: IAdvancedTopic = {
      name: topicData.name,
      numPartitions: String(topicData.numPartitions),
      'retention.ms': String(topicData.retentionTime),
      'retention.bytes': String(topicData.retentionBytes),
      'retention.bytes.unit':
        topicData.retentionBytesUnit === 'custom'
          ? String(topicData.customRetentionSizeUnit)
          : String(topicData.retentionBytesUnit),
      'retention.ms.unit':
        topicData.retentionTimeUnit === 'custom'
          ? String(topicData.customRetentionTimeUnit)
          : String(topicData.retentionTimeUnit),
      'cleanup.policy': String(topicData.cleanupPolicy),
    };
    const topic: NewTopicInput = serializeTopic(
      convertedTopicData,
      isSwitchChecked ? ['cleanup.policy'] : []
    );
    new TopicsApi(
      new Configuration({
        basePath: config?.basePath,
        accessToken: config?.getToken,
      })
    )
      .createTopic(topic)
      .then(() => {
        addAlert({
          variant: AlertVariant.success,
          title: t('topic.topic_successfully_created'),
        });
        //setIsLoading(false);
        onCloseCreateTopic();
      })
      .catch((err) => {
        //setIsLoading(false);
        addAlert({
          variant: AlertVariant.danger,
          title: err.response.data.error_message,
        });
        onCloseCreateTopic();
      });
  };
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };
  const constantValues = {
    DEFAULT_REPLICAS: 3,
    DEFAULT_MIN_CLEANBLE_RATIO: 0.5,
    DEFAULT_MIN_INSYNC_REPLICAS: 2,
    DEFAULT_SEGMENT_TIME_MILLISECONDS: 604800000,
    DEFAULT_MAX_MESSAGE_TIMESTAMP_DIFF_MILLISECONDS: '9223372036854775807',
    DEFAULT_SEGMENT_INDEX_SIZE_BYTES: 10485760,
    DEFAULT_INDEX_INTERVAL_SIZE_BYTES: 4096,
    DEFAULT_LOG_SEGMENT_SIZE_BYTES: 1073741824,
    DEFAULT_DELETE_RETENTION_TIME_MILLISECONDS: 86400000,
    DEFAULT_SEGMENT_JITTER_TIME_MILLISECONDS: 0,
    DEFAULT_FILE_DELETE_DELAY_MILLISECONDS: 60000,
    DEFAULT_MAXIMUM_MESSAGE_BYTES: 1048588,
    DEFAULT_MESSAGE_TIMESTAMP_TYPE: 'CreateTime',
    DEFAULT_MINIMUM_COMPACTION_LAG_TIME_MILLISECONDS: 0,
    DEFAULT_FLUSH_INTERVAL_MESSAGES: '9223372036854775807',
    DEFAULT_FLUSH_INTERVAL_TIME_MILLISECONDS: '9223372036854775807',
  };
  const initialTopicValues: NewTopic = {
    name: '',
    numPartitions: 1,
    replicationFactor: replicationFactor || 1,
    retentionTime: 1,
    retentionTimeUnit: isSwitchChecked ? 'custom' : 'weeks',
    retentionBytes: 1,
    retentionBytesUnit: isSwitchChecked ? 'custom' : 'unlimited',
    cleanupPolicy: 'delete',
    customRetentionTimeUnit: 'days',
    customRetentionSizeUnit: 'bytes',
    minInSyncReplica: minInSyncReplicas || 1,
    isMultiAZ: isMultiAZ || false,
  };
  const fetchTopic = async (topicName: string) => {
    try {
      const topicRes = await getTopic(topicName, config);
      if (topicRes) {
        return false;
      } else return true;
    } catch (error) {
      return true;
    }
  };

  return (
    <CreateTopicPage
      kafkaName={kafkaName || ''}
      kafkaPageLink={kafkaPageLink || ''}
      kafkaInstanceLink={kafkaInstanceLink || ''}
      onSave={saveTopic}
      initialTopicValues={initialTopicValues}
      onCloseCreateTopic={onCloseCreateTopic}
      checkTopicName={fetchTopic}
      availablePartitionLimit={12}
      constantValues={constantValues}
      isSwitchChecked={isSwitchChecked}
      setIsSwitchChecked={setIsSwitchChecked}
    />
  );
};
