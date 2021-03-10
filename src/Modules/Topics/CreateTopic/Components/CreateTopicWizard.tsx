import React, { useContext, useState } from 'react';
import {
  AlertVariant,
  Divider,
  PageSection,
  PageSectionVariants,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { StepTopicName } from './StepTopicName';
import { StepPartitions } from './StepPartitions';
import { StepMessageRetention } from './StepMessageRetention';
import { StepReplicas } from './StepReplicas';
import './CreateTopicWizard.css';
import { TopicAdvanceConfig } from './TopicAdvanceConfig';
import { DefaultApi, NewTopicInput } from '../../../../OpenApi/api';
import { TopicContext } from '../../../../Contexts/Topic';
import { convertUnits, formatTopicRequest } from '../utils';
import { ConfigContext } from '../../../../Contexts';
import { Configuration } from '../../../../OpenApi';
import { AlertContext } from '../../../../Contexts/Alert/Context';

interface ICreateTopicWizard {
  isSwitchChecked: boolean;
  setIsCreateTopic?: (value: boolean) => void;
}

export const CreateTopicWizard: React.FC<ICreateTopicWizard> = ({
  setIsCreateTopic,
  isSwitchChecked,
}) => {
  const config = useContext(ConfigContext);
  const { addAlert } = useContext(AlertContext);

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
          addAlert(
            'The topic was successfully created in the Kafka instance',
            AlertVariant.success
          );
        }
        closeWizard();
      })
      .catch((err) => {
        addAlert(err.response.data.err, AlertVariant.danger);
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
