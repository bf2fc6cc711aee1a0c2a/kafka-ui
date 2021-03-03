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
import { getTopic, updateTopicModel } from 'Services/index';
import { Topic, TopicSettings, ConfigEntry } from 'OpenApi/api';
import { AdvancedTopic, TopicContext } from 'Contexts/Topic';
import { ConfigContext } from 'Contexts';

export const UpdateTopic: React.FC = () => {
  const { store, updateBulkStore } = React.useContext(TopicContext);
  const [alertVisible, setAlertVisible] = useState(false);
  const { name } = useParams<any>();
  let topic: Topic;
  const config = useContext(ConfigContext);

  const fetchTopic = async (topicName) => {
    topic = await getTopic(topicName, config);

    if (topic) saveToStore(topic);
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

  const patchConfig = (previousTopic: Topic) => {
    const updatedConfig: Array<ConfigEntry> = [];
    previousTopic.config?.forEach((item) => {
      if (item.key) {
        if (store[item.key] != item.value) {
          updatedConfig.push({ key: item.key, value: store[item.key] });
        }
      }
    });
    return updatedConfig;
  };

  const saveTopic = async () => {
    const newConfig = await patchConfig(topic);
    const topicSettings: TopicSettings = {
      numPartitions: Number(store.numPartitions),
      replicationFactor: Number(store.replicationFactor),
      config: newConfig,
    };

    const updateResponse = await updateTopicModel(
      store.name,
      topicSettings,
      config
    );
    console.log('updateResponse', updateResponse);
    setAlertVisible(true);
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
          <TopicAdvanceConfig isCreate={false} saveTopic={saveTopic} />
        </PageSection>
      </>
    </>
  );
};
