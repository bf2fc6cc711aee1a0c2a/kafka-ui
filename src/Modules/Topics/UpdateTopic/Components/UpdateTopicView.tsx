import React, { useContext, useEffect, useState } from 'react';
import { AlertVariant } from '@patternfly/react-core';
import '../../CreateTopic/Components/CreateTopicWizard.css';
import { TopicAdvanceConfig } from '../../CreateTopic/Components/TopicAdvanceConfig';
import { getTopic, updateTopicModel } from '../../../../Services/index';
import { ConfigEntry, Topic, TopicSettings } from '../../../../OpenApi/api';
import { initialState, TopicContext } from '../../../../Contexts/Topic';
import { DeleteTopics } from '../../TopicList/Components/DeleteTopicsModal';
import { AlertContext } from '../../../../Contexts/Alert';
import { ConfigContext } from '../../../../Contexts';

export type UpdateTopicViewProps = {
  topicName: string;
  onCancelUpdateTopic: () => void;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
};
export const UpdateTopicView: React.FunctionComponent<UpdateTopicViewProps> = ({
  topicName,
  onCancelUpdateTopic,
  onDeleteTopic,
  onSaveTopic,
}) => {
  const { store, updateBulkStore } = React.useContext(TopicContext);
  const [deleteModal, setDeleteModal] = useState(false);

  const [topic, setTopic] = useState<Topic>();
  const config = useContext(ConfigContext);
  const { addAlert } = useContext(AlertContext);
  const fetchTopic = async (topicName) => {
    const topicRes = await getTopic(topicName, config);
    setTopic(topicRes);
    if (topicRes) saveToStore(topicRes);
  };

  useEffect(() => {
    (async function () {
      await updateBulkStore(initialState);
      fetchTopic(topicName);
    })();
  }, []);

  const saveToStore = (topic: Topic) => {
    const advanceConfig = store;

    advanceConfig.numPartitions = topic?.partitions?.length.toString() || '0';
    advanceConfig.name = topic.name || '';
    topic.config?.forEach((configItem) => {
      advanceConfig[configItem.key || ''] = configItem.value || '';
    });
    updateBulkStore(advanceConfig);
  };

  const patchConfig = (
    previousTopic: Topic | undefined
  ): ConfigEntry[] | undefined => {
    return previousTopic?.config
      ?.map((v) => {
        if (v.key) {
          return {
            key: v.key,
            value: store[v.key],
          };
        }
        return v;
      })
      .filter((v) => v.key !== 'replicationFactor');
  };

  const saveTopic = async () => {
    const newConfig = patchConfig(topic);

    const topicSettings: TopicSettings = {
      // TODO Re-enable when the API supports setting the number of partition
      // numPartitions: Number(store.numPartitions),
      config: newConfig,
    };

    try {
      const updateStatus = await updateTopicModel(
        store.name,
        topicSettings,
        config
      );

      if (updateStatus === 200) {
        addAlert(
          'The topic was successfully updated in the Kafka instance',
          AlertVariant.success
        );
        onSaveTopic();
      }
    } catch (err) {
      addAlert(err.response.data.error, AlertVariant.danger);
    }
    updateBulkStore(initialState);
  };

  return (
    <>
      <TopicAdvanceConfig
        isCreate={false}
        saveTopic={saveTopic}
        handleCancel={onCancelUpdateTopic}
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
    </>
  );
};
