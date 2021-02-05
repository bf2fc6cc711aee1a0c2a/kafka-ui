/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from 'react';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  PageSection,
  PageSectionVariants,
  Switch,
  Title,
  Wizard,
} from '@patternfly/react-core';
import { StepTopicName } from './StepTopicName.patternfly';
import { StepPartitions } from './StepPartitions.patternfly';
import { StepMessageRetention } from './StepMessageRetention.patternfly';
import { StepReplicas } from './StepReplicas.patternfly';
import './CreateTopicWizard.patternfly.css';
import { CREATE_TOPIC } from 'Queries/Topics';
import { useMutation } from '@apollo/client';
import { NewTopic } from 'Entities/Entities.generated';
import { TopicAdvanceConfig } from './TopicAdvanceConfig.patternfly';

interface ICreateTopicWizard {
  setIsCreateTopic?: (value: boolean) => void;
}

export const CreateTopicWizard: React.FC<ICreateTopicWizard> = ({
  setIsCreateTopic,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [msgRetentionValue, setMsgRetentionValue] = useState(1);
  const [topicNameInput, setTopicNameInput] = useState('');
  const [partitionTouchspinValue, setPartitionTouchspinValue] = useState(1);
  const [
    replicationFactorTouchspinValue,
    setReplicationFactorTouchspinValue,
  ] = useState(1);
  const [
    minInSyncReplicaTouchspinValue,
    setMinInSyncReplicaTouchspinValue,
  ] = useState(1);

  const [createTopic] = useMutation(CREATE_TOPIC);
  const addTopic = async (newTopic: NewTopic) => {
    await createTopic({ variables: { topic: newTopic } });
  };
  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to='/openshiftstreams'>
        Red Hat OpenShift Streams for Apache Kafka
      </BreadcrumbItem>
      <BreadcrumbItem to='/openshiftstreams'>
        MK Cluster Instance
      </BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        Create topic
      </BreadcrumbItem>
    </Breadcrumb>
  );

  const handleAlertClose = () => {
    setAlertVisible(true);
  };

  const closeWizard = () => {
    if (setIsCreateTopic) {
      setIsCreateTopic(false);
    }
  };

  const saveTopic = async () => {
    //Object may change based on schema
    const topic: NewTopic = {
      name: topicNameInput,
      numPartitions: partitionTouchspinValue,
      replicationFactor: replicationFactorTouchspinValue,
    };
    await addTopic(topic);
    setAlertVisible(true);
    closeWizard();
  };

  const steps = [
    {
      name: 'Topic name',
      component: (
        <StepTopicName
          topicNameInput={topicNameInput}
          setTopicNameInput={setTopicNameInput}
        />
      ),
    },
    {
      name: 'Partitions',
      component: (
        <StepPartitions
          partitionTouchspinValue={partitionTouchspinValue}
          setPartitionTouchspinValue={setPartitionTouchspinValue}
        />
      ),
    },
    {
      name: 'Message retention',
      component: (
        <StepMessageRetention setMsgRetentionValue={setMsgRetentionValue} />
      ),
    },
    {
      name: 'Replicas',
      component: (
        <StepReplicas
          setReplicationFactorTouchspinValue={
            setReplicationFactorTouchspinValue
          }
          setMinInSyncReplicaTouchspinValue={setMinInSyncReplicaTouchspinValue}
          replicationFactorTouchspinValue={replicationFactorTouchspinValue}
          minInSyncReplicaTouchspinValue={minInSyncReplicaTouchspinValue}
        />
      ),
      nextButtonText: 'Finish',
    },
  ];

  const title = 'Create topics wizard';

  return (
    <>
      <section className='pf-c-page__main-breadcrumb'>
        {mainBreadcrumbs}
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <AlertGroup isToast>
          {alertVisible ? (
            <Alert
              isLiveRegion
              variant='success'
              title='OpenShift Streams topic created'
              actionClose={
                <AlertActionCloseButton
                  aria-label='Close success alert'
                  onClose={handleAlertClose}
                />
              }
            >
              The topic was successfully created in the Kafka instance.
            </Alert>
          ) : (
            <></>
          )}
        </AlertGroup>

        <Title headingLevel='h1' size='lg'>
          Create topic
        </Title>
        <Switch
          id='simple-switch'
          label='Show all available options'
          labelOff='Show all available options'
          isChecked={isSwitchChecked}
          onChange={setIsSwitchChecked}
          className='create-topic-wizard'
        />
      </PageSection>
      <Divider />
      {isSwitchChecked ? (
        <>
          <Divider />
          <PageSection variant={PageSectionVariants.light}>
            <TopicAdvanceConfig isCreate={true} saveTopic={saveTopic} />
          </PageSection>
        </>
      ) : (
        <PageSection
          variant={PageSectionVariants.light}
          padding={{ default: 'noPadding' }}
        >
          <Wizard
            navAriaLabel={`${title} steps`}
            mainAriaLabel={`${title} content`}
            steps={steps}
            onClose={closeWizard}
            onSave={saveTopic}
          />
        </PageSection>
      )}
    </>
  );
};
