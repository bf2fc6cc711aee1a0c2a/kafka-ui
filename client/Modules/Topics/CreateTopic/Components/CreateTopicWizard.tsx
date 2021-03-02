import React, { useContext, useState } from 'react';
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
  WizardStep,
} from '@patternfly/react-core';
import { StepTopicName } from './StepTopicName';
import { StepPartitions } from './StepPartitions';
import { StepMessageRetention } from './StepMessageRetention';
import { StepReplicas } from './StepReplicas';
import './CreateTopicWizard.css';
import { TopicAdvanceConfig } from './TopicAdvanceConfig';
import { DefaultApi, NewTopicInput } from 'OpenApi/api';
import { TopicContext } from 'Contexts/Topic';
import { convertUnits, formatTopicRequest } from '../utils';
import { ConfigContext } from 'Contexts';
import { Configuration } from 'OpenApi';

interface ICreateTopicWizard {
  setIsCreateTopic?: (value: boolean) => void;
}

export const CreateTopicWizard: React.FC<ICreateTopicWizard> = ({
  setIsCreateTopic,
}) => {
  const config = useContext(ConfigContext);

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
  const { store } = React.useContext(TopicContext);

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

  const saveTopic = () => {
    //Object may change based on schema

    const topic: NewTopicInput = isSwitchChecked
      ? formatTopicRequest(convertUnits(store))
      : {
          name: topicNameInput,
          settings: {
            numPartitions: partitionTouchspinValue,
            replicationFactor: replicationFactorTouchspinValue,
          },
        };

    new DefaultApi(
      new Configuration({
        basePath: config?.basePath,
        accessToken: config?.getToken,
      })
    )
      .createTopic(topic)
      .then((res) => {
        if (res.status === 200) {
          setAlertVisible(true);
        }
        closeWizard();
      });
  };

  const steps: WizardStep[] = [
    {
      name: 'Topic name',
      enableNext: topicNameInput.trim() !== '',
      component: (
        <StepTopicName
          topicNameInput={topicNameInput}
          setTopicNameInput={setTopicNameInput}
        />
      ),
    },
    {
      name: 'Partitions',
      canJumpTo: topicNameInput.trim() !== '',
      component: (
        <StepPartitions
          partitionTouchspinValue={partitionTouchspinValue}
          setPartitionTouchspinValue={setPartitionTouchspinValue}
        />
      ),
    },
    {
      name: 'Message retention',
      canJumpTo: topicNameInput.trim() !== '',
      component: (
        <StepMessageRetention setMsgRetentionValue={setMsgRetentionValue} />
      ),
    },
    {
      name: 'Replicas',
      canJumpTo: topicNameInput.trim() !== '',
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
