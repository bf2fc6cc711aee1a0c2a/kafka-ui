import React, { useContext, useState } from 'react';
import {
  AlertVariant,
  Divider,
  PageSection,
  PageSectionTypes,
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
import { convertUnits, formatTopicRequest } from '../utils';
import { ConfigContext } from '../../../../Contexts';
import { Configuration } from '../../../../OpenApi';
import { AlertContext } from '../../../../Contexts/Alert/Context';
import { useHistory } from 'react-router';

interface ICreateTopicWizard {
  isSwitchChecked: boolean;
  setIsCreateTopic?: (value: boolean) => void;
}

export interface IAdvancedTopic {
  /** unique identifier for a topic within the cluster */
  name: string;
  /** ordered list of messages that make up a topic */
  numPartitions: string;
  /** the length of time that messages are retained before they are deleted */
  'retention.ms'?: string;
  /** unit for retention time */
  'retention.ms.unit'?: string;
  /** maximum total size of a partition's log segments before old log segments are deleted */
  'retention.bytes'?: string;
  /** unit for retention bytes */
  'retention.bytes.unit'?: string;

  'cleanup.policy'?: string;
}

export const CreateTopicWizard: React.FC<ICreateTopicWizard> = ({
  setIsCreateTopic,
  isSwitchChecked,
}) => {
  const config = useContext(ConfigContext);
  const history = useHistory();
  const { addAlert } = useContext(AlertContext);
  const [msgRetentionValue, setMsgRetentionValue] = useState(1);
  const [retentionSize, setRetentionSize] = useState(1);
  const [topicNameInput, setTopicNameInput] = useState('');
  const [partitionTouchspinValue, setPartitionTouchspinValue] = useState(1);
  const [replicationFactorTouchspinValue] = useState(3);
  const [minInSyncReplicaTouchspinValue] = useState(2);
  const [topicData, setTopicData] = useState<IAdvancedTopic>({
    name: '',
    numPartitions: '1',
    'retention.ms': '7',
    'retention.ms.unit': 'days',
    'retention.bytes': '-1',
    'retention.bytes.unit': 'bytes',
    'cleanup.policy': 'delete',
  });

  const [currentPeriod, setCurrentPeriod] = React.useState<string | number>(
    86400000
  );
  const [currentSize, setCurrentSize] = React.useState<string | number>(-1);

  const closeWizard = () => {
    if (setIsCreateTopic) {
      setIsCreateTopic(false);
    }
  };

  const saveTopic = () => {
    // Object may change based on schema

    const topic: NewTopicInput = isSwitchChecked
      ? formatTopicRequest(convertUnits(topicData))
      : {
          name: topicNameInput,
          settings: {
            numPartitions: partitionTouchspinValue,
            config: [
              {
                key: 'retention.ms',
                value: msgRetentionValue.toString(),
              },
              { key: 'retention.bytes', value: retentionSize.toString() },
            ],
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
        addAlert(err.response.data.error, AlertVariant.danger);
        closeWizard();
      });
  };

  const handleCancel = () => {
    history.push('/topics');
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
        <StepMessageRetention
          setMsgRetentionValue={setMsgRetentionValue}
          currentPeriod={currentPeriod}
          currentSize={currentSize}
          setCurrentPeriod={setCurrentPeriod}
          setCurrentSize={setCurrentSize}
          setRetentionSize={setRetentionSize}
        />
      ),
    },
    {
      name: 'Replicas',
      canJumpTo: topicNameInput.trim() !== '',
      component: (
        <StepReplicas
          replicationFactor={replicationFactorTouchspinValue}
          minInSyncReplica={minInSyncReplicaTouchspinValue}
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
            <TopicAdvanceConfig
              isCreate={true}
              saveTopic={saveTopic}
              handleCancel={handleCancel}
              topicData={topicData}
              setTopicData={setTopicData}
            />
          </PageSection>
        </>
      ) : (
        <PageSection
          variant={PageSectionVariants.light}
          type={PageSectionTypes.wizard}
          isFilled
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
