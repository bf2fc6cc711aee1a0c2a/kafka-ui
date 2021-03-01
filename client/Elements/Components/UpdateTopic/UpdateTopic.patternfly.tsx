/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

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
import '../CreateTopic/CreateTopicWizard.patternfly.css';
import { TopicAdvanceConfig } from '../CreateTopic//TopicAdvanceConfig.patternfly';
import { useParams } from 'react-router';
import { getTopic, updateTopicModel } from 'Services/index';
import { Topic, TopicSettings } from 'OpenApi/api';
import { AdvancedTopic, TopicContext } from 'Contexts/Topic';
import { ConfigContext } from 'Contexts';

export const UpdateTopic: React.FC = () => {
  const { store, updateBulkStore } = React.useContext(TopicContext);
  const [alertVisible, setAlertVisible] = useState(false);
  const { name } = useParams<any>();

  const config = useContext(ConfigContext);

  const fetchTopic = async (topicName) => {
    const topic = await getTopic(topicName, config);
    if (topic) saveToStore(topic);
  };

  useEffect(() => {
    fetchTopic(name);
  }, []);

  const saveToStore = (topic: Topic) => {
    const advanceConfig: AdvancedTopic = store;
    advanceConfig.numPartitions = topic?.partitions?.length.toString() || "0";
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

  const saveTopic = async () => {
    const topicSettings: TopicSettings = {
      numPartitions: Number(store.numPartitions),
      replicationFactor: Number(store.replicationFactor),
      config: [
        {
          key: 'min.insync.replicas',
          value: store['min.insync.replicas'],
        },
      ],
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
