import React, { useContext, useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertVariant } from '@patternfly/react-core';
import {
  TopicAdvanceConfig,
  IAdvancedTopic,
} from '@app/modules/Topics/components';
import { getTopic, updateTopicModel } from '@app/services';
import { ConfigEntry, TopicSettings } from '@rhoas/kafka-instance-sdk';
import { ConfigContext } from '@app/contexts';
import { convertUnits } from '@app/modules/Topics/utils';
import { isAxiosError } from '@app/utils/axios';
import { useAlert, useBasename } from '@bf2/ui-shared';
import '../CreateTopicWizard/CreateTopicWizard.css';

export type UpdateTopicViewProps = {
  topicName: string;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
};
export const UpdateTopicView: React.FunctionComponent<UpdateTopicViewProps> = ({
  topicName,
  onSaveTopic,
  onError,
}) => {
  const { t } = useTranslation();
  const config = useContext(ConfigContext);
  const { addAlert } = useAlert();
  const history = useHistory();
  const { getBasename } = useBasename();
  const basename = getBasename();

  const initialState = {
    name: topicName,
    numPartitions: '',
    'retention.ms': '',
    'retention.ms.unit': 'milliseconds',
    'retention.bytes': '',
    'retention.bytes.unit': 'bytes',
    'cleanup.policy': '',
  };

  const [topicData, setTopicData] = useState<IAdvancedTopic>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

    const onCancelUpdateTopic = () => {
    history.push(`${basename}/topics/${topicName}`);
  };

  const fetchTopic = async (topicName) => {
    try {
      const topicRes = await getTopic(topicName, config);
      const configEntries: any = {};
      topicRes.config?.forEach((configItem) => {
        configEntries[configItem.key || ''] = configItem.value || '';
      });

      setTopicData({
        ...topicData,
        numPartitions: topicRes?.partitions?.length.toString() || '',
        'cleanup.policy': configEntries['cleanup.policy'] || 'delete',
        'retention.bytes': configEntries['retention.bytes'] || '-1',
        'retention.ms': configEntries['retention.ms'] || '604800000',
      });
    } catch (err) {
      if (isAxiosError(err)) {
        if (onError) {
          onError(err.response?.data.code, err.response?.data.error_message);
        }
        if (err.response?.status === 404) {
          // then it's a non-existent topic
          addAlert({
            variant: AlertVariant.danger,
            title: `Topic ${topicName} does not exist`,
          });
          onCancelUpdateTopic && onCancelUpdateTopic();
        }
      }
    }
  };

  useEffect(() => {
    fetchTopic(topicName);
  }, [topicName]);

  const saveTopic = async () => {
    const { name, ...configEntries } = convertUnits(topicData);
    const newConfig: ConfigEntry[] = [];
    setIsLoading(true);

    for (const key in configEntries) {
      // TODO Remove check when API supports setting the number of partition
      if (key && key !== 'numPartitions') {
        newConfig.push({
          key,
          value: configEntries[key].toString().toLowerCase(),
        });
      }
    }

    const topicSettings: TopicSettings = {
      // TODO Re-enable when the API supports setting the number of partition
      numPartitions: Number(topicData.numPartitions),
      config: newConfig,
    };

    try {
      await updateTopicModel(name, topicSettings, config).then(() => {
        addAlert({
          title: t('topic.topic_successfully_updated'),
          variant: AlertVariant.success,
        });
        setIsLoading(false);
        onSaveTopic();
      });
    } catch (err) {
      if (onError) {
        onError(err.response.data.code, err.response.data.error_message);
      }
      setIsLoading(false);
      addAlert({
        title: err.response.data.error_message,
        variant: AlertVariant.danger,
      });
    }
  };

  return (
    <>
      <TopicAdvanceConfig
        isCreate={false}
        saveTopic={saveTopic}
        handleCancel={onCancelUpdateTopic}
        topicData={topicData}
        setTopicData={setTopicData}
        isLoadingSave={isLoading}
      />
      <br />
      <br />
    </>
  );
};
