import React, { useContext, useState } from 'react';
import {
  AlertVariant,
  Divider,
  PageSection,
  PageSectionTypes,
  PageSectionVariants,
  Wizard,
  WizardStep,
  WizardFooter,
  WizardContextConsumer,
  Button,
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
import { useTranslation } from 'react-i18next';
import { getTopic } from '../../../../Services/index';

interface ICreateTopicWizard {
  isSwitchChecked: boolean;
  setIsCreateTopic?: (value: boolean) => void;
  onCloseCreateTopic: () => void;
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
  /** determines whether messages that reach the retention window are deleted or compacted */
  'cleanup.policy'?: string;
}

export const CreateTopicWizard: React.FC<ICreateTopicWizard> = ({
  setIsCreateTopic,
  isSwitchChecked,
  onCloseCreateTopic,
}) => {
  const config = useContext(ConfigContext);
  const { t } = useTranslation();
  const { addAlert } = useContext(AlertContext);
  const [msgRetentionValue, setMsgRetentionValue] = useState(1);
  const [retentionSize, setRetentionSize] = useState(1);
  const [topicNameInput, setTopicNameInput] = useState('');
  const [partitionTouchspinValue, setPartitionTouchspinValue] = useState(1);
  const [replicationFactorTouchspinValue] = useState(3);
  const [minInSyncReplicaTouchspinValue] = useState(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [topicNameValidated, setTopicNameValidated] = useState<
    'error' | 'default'
  >('default');
  const [invalidText, setInvalidText] = useState('');
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
    604800000
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
          addAlert(t('topic.topic_successfully_created'), AlertVariant.success);
        }
        closeWizard();
      })
      .catch((err) => {
        addAlert(err.response.data.error_message, AlertVariant.danger);
        closeWizard();
      });
  };

  const fetchTopic = async (topicName, onNext) => {
    try {
      const topicRes = await getTopic(topicName, config);
      if (topicRes) {
        setInvalidText(t('topic.already_exists', { name: topicName }))
        setTopicNameValidated('error');
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response.status == '404') {
        setTopicNameValidated('default');

        onNext();
      }
    }
  };

  const steps: WizardStep[] = [
    {
      name: t('topic.topic_name'),
      enableNext:
        topicNameInput.trim() !== '' && topicNameValidated === 'default',
      component: (
        <StepTopicName
          topicNameInput={topicNameInput}
          setTopicNameInput={setTopicNameInput}
          topicNameValidated={topicNameValidated}
          setTopicNameValidated={setTopicNameValidated}
          invalidText={invalidText}
          setInvalidText={setInvalidText}
        />
      ),
    },
    {
      name: t('common.partitions'),
      canJumpTo: topicNameInput.trim() !== '',
      component: (
        <StepPartitions
          partitionTouchspinValue={partitionTouchspinValue}
          setPartitionTouchspinValue={setPartitionTouchspinValue}
        />
      ),
    },
    {
      name: t('topic.message_retention'),
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
      name: t('common.replicas'),
      canJumpTo: topicNameInput.trim() !== '',
      component: (
        <StepReplicas
          replicationFactor={replicationFactorTouchspinValue}
          minInSyncReplica={minInSyncReplicaTouchspinValue}
        />
      ),
      nextButtonText: t('common.finish'),
    },
  ];

  const title = t('topic.wizard_title');

  const onValidate = (onNext) => {
    if (topicNameInput.length < 1) {
      setInvalidText(t('topic.required'));
      setTopicNameValidated('error');
    } else {
      setIsLoading(true);
      fetchTopic(topicNameInput, onNext);
    }
  };

  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack }) => {
          if (activeStep.name == t('topic.topic_name')) {
            return (
              <>
                <Button
                  variant='primary'
                  type='submit'
                  isLoading={isLoading}
                  onClick={() => onValidate(onNext)}
                  isDisabled={topicNameValidated == 'default' ? false : true}
                >
                  {t('common.next')}
                </Button>
                <Button variant='secondary' isDisabled={true}>
                  {t('common.back')}
                </Button>
                <Button variant='link' onClick={closeWizard}>
                  {t('common.cancel')}
                </Button>
              </>
            );
          }

          if (activeStep.name == 'Replicas') {
            return (
              <>
                <Button variant='primary' type='submit' onClick={onNext}>
                  {t('common.finish')}
                </Button>
                <Button variant='secondary' onClick={onBack}>
                  {t('common.back')}
                </Button>
                <Button variant='link' onClick={closeWizard}>
                  {t('common.cancel')}
                </Button>
              </>
            );
          }
          return (
            <>
              <Button variant='primary' type='submit' onClick={onNext}>
                {t('common.next')}
              </Button>
              <Button variant='secondary' onClick={onBack}>
                {t('common.back')}
              </Button>
              <Button variant='link' onClick={closeWizard}>
                {t('common.cancel')}
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );

  return (
    <>
      {isSwitchChecked ? (
        <>
          <Divider className='kafka-ui--divider--FlexShrink' />
          <PageSection variant={PageSectionVariants.light}>
            <TopicAdvanceConfig
              isCreate={true}
              saveTopic={saveTopic}
              handleCancel={onCloseCreateTopic}
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
            data-testid='topicBasicCreate-Wizard'
            footer={CustomFooter}
          />
        </PageSection>
      )}
    </>
  );
};
