import React, { useContext, useEffect, useState } from 'react';
import { AlertVariant } from '@patternfly/react-core';
import '../../CreateTopic/Components/CreateTopicWizard.css';
import { TopicAdvanceConfig } from '../../CreateTopic/Components/TopicAdvanceConfig';
import { useParams, useHistory } from 'react-router';
import { getTopic, updateTopicModel } from '../../../../Services/index';
import { Topic, TopicSettings } from '../../../../OpenApi/api';
import { AdvancedTopic, TopicContext } from '../../../../Contexts/Topic';
import { ConfigContext } from '../../../../Contexts';
import { DeleteTopics } from '../../TopicList/Components/DeleteTopicsModal';
import { AlertContext } from '../../../../Contexts/Alert';

export const UpdateTopicView: React.FC = () => {
  const { store, updateBulkStore } = React.useContext(TopicContext);
  const { topicName } = useParams<any>();
  const [deleteModal, setDeleteModal] = useState(false);

  const [topic, setTopic] = useState<Topic>();
  const config = useContext(ConfigContext);
  const { addAlert } = useContext(AlertContext);
  const history = useHistory();
  const fetchTopic = async (topicName) => {
    const topicRes = await getTopic(topicName, config);
    setTopic(topicRes);
    if (topicRes) saveToStore(topicRes);
  };

  useEffect(() => {
    fetchTopic(topicName);
  }, []);

  const saveToStore = (topic: Topic) => {
    const advanceConfig: AdvancedTopic = store;
    advanceConfig.numPartitions = topic?.partitions?.length.toString() || '0';
    advanceConfig.name = topic.name || '';
    topic.config?.forEach((configItem) => {
      advanceConfig[configItem.key || ''] = configItem.value || '';
    });
    updateBulkStore(advanceConfig);
  };

  const deleteTopic = () => {
    setDeleteModal(true);
  };

  const patchConfig = (previousTopic: Topic) => {
    const updatedConfig = previousTopic.config?.length
      ? previousTopic.config.filter((item) => {
          if (item.key && store[item.key] != item.value)
            return { key: item.key, value: store[item.key] };
        })
      : Object.keys(store).map((key) => {
          return { key: key, value: store[key] };
        });
    return updatedConfig;
  };

  const saveTopic = async () => {
    const newConfig = topic && (await patchConfig(topic));

    const topicSettings: TopicSettings = {
      numPartitions: Number(store.numPartitions),
      replicationFactor: Number(store.replicationFactor),
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
        history.push(`/topic/${topicName}`);
      }
    } catch (err) {
      addAlert(err.response.data.err, AlertVariant.danger);
    }
  };

  return (
    <>
      <TopicAdvanceConfig
        isCreate={false}
        saveTopic={saveTopic}
        deleteTopic={deleteTopic}
      />
      <br />
      <br />
      {deleteModal && (
        <DeleteTopics
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          topicName={topicName}
        />
      )}
    </>
  );
};
