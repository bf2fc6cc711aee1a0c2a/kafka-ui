import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';
import '../../CreateTopic/Components/CreateTopicWizard.css';
import { TopicAdvanceConfig } from '../../CreateTopic/Components/TopicAdvanceConfig';
import { useParams } from 'react-router';
import { getTopic, updateTopicModel } from '../../../../Services/index';
import { Topic, TopicSettings } from '../../../../OpenApi/api';
import { AdvancedTopic, TopicContext } from '../../../../Contexts/Topic';
import { ConfigContext } from '../../../../Contexts';
import { DeleteTopics } from '../../../../Modules/Topics/TopicList/Components/DeleteTopicsModal';

export const UpdateTopic: React.FC = () => {
  const { store, updateBulkStore } = React.useContext(TopicContext);
  const [alertVisible, setAlertVisible] = useState(false);
  const { name } = useParams<any>();
  const [deleteModal, setDeleteModal] = useState(false);

  const [topic, setTopic] = useState<Topic>();
  const config = useContext(ConfigContext);

  const fetchTopic = async (topicName) => {
    const topicRes = await getTopic(topicName, config);
    setTopic(topicRes);
    if (topicRes) saveToStore(topicRes);
  };

  useEffect(() => {
    fetchTopic(name);
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

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to='/#/topics'>Topics</BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        {name}
      </BreadcrumbItem>
    </Breadcrumb>
  );

  const handleAlertClose = () => {
    setAlertVisible(true);
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

    const updateStatus = await updateTopicModel(
      store.name,
      topicSettings,
      config
    );

    //Todo: handle alert based on update response
    if (updateStatus === 204) setAlertVisible(true);
  };

  return (
    <>
      <section
        className='pf-c-page__main-breadcrumb'
        style={{ padding: '20px 20px' }}
      >
        {mainBreadcrumbs}
        <br />
        <br />
        <Title headingLevel='h1' size='xl'>
          {name}
        </Title>
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <AlertGroup isToast>
          {alertVisible ? (
            <Alert
              isLiveRegion
              variant='success'
              title='OpenShift Streams topic updated'
              actionClose={
                <AlertActionCloseButton
                  aria-label='Close success alert'
                  onClose={handleAlertClose}
                />
              }
            >
              The topic was successfully updated in the Kafka instance.
            </Alert>
          ) : (
            <></>
          )}
        </AlertGroup>
      </PageSection>
      <Divider />
      <>
        <Divider />
        <PageSection variant={PageSectionVariants.light}>
          <TopicAdvanceConfig
            isCreate={false}
            saveTopic={saveTopic}
            deleteTopic={deleteTopic}
          />
        </PageSection>
        {deleteModal && (
          <DeleteTopics
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            topicName={name}
          />
        )}
      </>
    </>
  );
};
