import React, { useContext, useEffect, useState } from 'react';
import { AlertVariant, PageSection } from '@patternfly/react-core';
import '../../CreateTopic/Components/CreateTopicWizard.css';
import { TopicAdvanceConfig } from '../../CreateTopic/Components/TopicAdvanceConfig';
import { getTopic, updateTopicModel } from '../../../../Services/index';
import { ConfigEntry, TopicSettings } from '../../../../OpenApi/api';
import { DeleteTopics } from '../../TopicList/Components/DeleteTopicsModal';
import { AlertContext } from '../../../../Contexts/Alert';
import { ConfigContext } from '../../../../Contexts';
import { IAdvancedTopic } from '../../CreateTopic/Components/CreateTopicWizard';
import { convertUnits } from '../../CreateTopic/utils';
import { isAxiosError } from '../../../../Utils/axios';

export type UpdateTopicViewProps = {
  topicName: string;
  onCancelUpdateTopic: () => void;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
};
export const UpdateTopicView: React.FunctionComponent<UpdateTopicViewProps> = ({
  topicName,
  onCancelUpdateTopic,
  onDeleteTopic,
  onSaveTopic,
  onError,
}) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const [topicData, setTopicData] = useState<IAdvancedTopic>({
    name: topicName,
    numPartitions: '',
    'retention.ms': '',
    'retention.ms.unit': 'milliseconds',
    'retention.bytes': '',
    'retention.bytes.unit': 'bytes',
    'cleanup.policy': '',
  });
  const config = useContext(ConfigContext);
  const { addAlert } = useContext(AlertContext);
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
          addAlert(`Topic ${topicName} does not exist`, AlertVariant.danger);
          onCancelUpdateTopic();
        }
      }
    }
  }

  useEffect(() => {
    fetchTopic(topicName)
  }, [topicName]);

  const saveTopic = async () => {
    const { name, ...configEntries } = convertUnits(topicData);

    const newConfig: ConfigEntry[] = [];

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
      // numPartitions: Number(topicData.numPartitions),
      config: newConfig,
    };

    try {
      const updateStatus = await updateTopicModel(name, topicSettings, config);

      if (updateStatus === 200) {
        addAlert(
          'The topic was successfully updated in the Kafka instance',
          AlertVariant.success
        );
        onSaveTopic();
      }
    } catch (err) {
      if (onError) {
        onError(err.response.data.code, err.response.data.error_message);
      }
      addAlert(err.response.data.error_message, AlertVariant.danger);
    }
  };

  return (
    <>
      <PageSection className='kafka-ui--page__main-section--adjust-padding'>
        <TopicAdvanceConfig
          isCreate={false}
          saveTopic={saveTopic}
          handleCancel={onCancelUpdateTopic}
          topicData={topicData}
          setTopicData={setTopicData}
        />
        <br />
        <br />
        {deleteModal && (
          <DeleteTopics
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            topicName={topicName}
            onDeleteTopic={onDeleteTopic}
          />
        )}
      </PageSection>
    </>
  );
};
