import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertVariant,
  Divider,
  PageSection,
  PageSectionTypes,
  PageSectionVariants,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import {
  IWizardFooter,
  StepMessageRetention,
  StepPartitions,
  StepReplicas,
  StepTopicName,
  TopicAdvanceConfig,
  WizardCustomFooter,
} from '@app/modules/Topics/components';
import {
  Configuration,
  NewTopicInput,
  TopicsApi,
} from '@rhoas/kafka-instance-sdk';
import {
  serializeTopic,
  IAdvancedTopic,
  RetentionSizeUnits,
  RetentionTimeUnits,
} from '@app/modules/Topics/utils';
import { ConfigContext, useFederated } from '@app/contexts';
import { getTopic } from '@app/services';
import { useAlert } from '@rhoas/app-services-ui-shared';
import './CreateTopicWizard.css';
import { isAxiosError } from '@app/utils/axios';

export type CreateTopicWizardProps = {
  isSwitchChecked: boolean;
  setIsCreateTopic?: (value: boolean) => void;
  onCloseCreateTopic: () => void;
};

export const CreateTopicWizard: React.FC<CreateTopicWizardProps> = ({
  isSwitchChecked,
  onCloseCreateTopic,
}) => {
  const { analytics } = useChrome();
  const config = useContext(ConfigContext);
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };

  const {
    replicationFactor = 0,
    minInSyncReplicas = 0,
    isMultiAZ,
    kafka,
  } = useFederated() || {};

  useEffect(() => {
    analytics.track('RHOSAK Create Topic', {
      entityId: kafka?.id,
      status: 'prompt',
    });
  }, [analytics, kafka?.id]);

  const initialFieldsValue = {
    name: '',
    numPartitions: '1',
    'retention.ms': '7',
    'retention.ms.unit': 'days',
    'retention.bytes': '1',
    'retention.bytes.unit': 'bytes',
    'cleanup.policy': 'delete',
    selectedRetentionTimeOption: RetentionTimeUnits.WEEK,
    selectedRetentionSizeOption: RetentionSizeUnits.UNLIMITED,
  };

  //states
  const [topicNameValidated, setTopicNameValidated] = useState<
    'error' | 'default'
  >('default');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invalidText, setInvalidText] = useState<string>('');
  const [topicData, setTopicData] =
    useState<IAdvancedTopic>(initialFieldsValue);

  const closeWizard = () => {
    onCloseCreateTopic && onCloseCreateTopic();
  };

  const saveTopic = () => {
    // Object may change based on schema
    setIsLoading(true);
    const configPropties = isSwitchChecked ? ['cleanup.policy'] : [];
    const topic: NewTopicInput = serializeTopic(topicData, configPropties);

    new TopicsApi(
      new Configuration({
        basePath: config?.basePath,
        accessToken: config?.getToken,
      })
    )
      .createTopic(topic)
      .then(() => {
        analytics.track('RHOSAK Create Topic', {
          entityId: kafka?.id,
          topic: topic.name,
          status: 'success',
        });
        addAlert({
          variant: AlertVariant.success,
          title: t('topic.topic_successfully_created'),
        });
        setIsLoading(false);
        closeWizard();
      })
      .catch((err) => {
        analytics.track('RHOSAK Create Topic', {
          entityId: kafka?.id,
          topic: topic.name,
          status: 'failure',
        });
        setIsLoading(false);
        addAlert({
          variant: AlertVariant.danger,
          title: err.response.data.error_message,
        });
        closeWizard();
      });
  };

  const fetchTopic = async (topicName: string, onNext: () => void) => {
    try {
      const topicRes = await getTopic(topicName, config);
      if (topicRes) {
        setInvalidText(t('topic.already_exists', { name: topicName }));
        setTopicNameValidated('error');
        setIsLoading(false);
      }
    } catch (error) {
      if (error && isAxiosError(error) && error.response?.status === 404) {
        setTopicNameValidated('default');
        setIsLoading(false);
        onNext();
      }
    }
  };

  const steps: WizardStep[] = [
    {
      name: t('topic.topic_name'),
      enableNext:
        topicData?.name.trim() !== '' && topicNameValidated === 'default',
      component: (
        <StepTopicName
          topicData={topicData}
          setTopicData={setTopicData}
          topicNameValidated={topicNameValidated}
          setTopicNameValidated={setTopicNameValidated}
          invalidText={invalidText}
          setInvalidText={setInvalidText}
        />
      ),
    },
    {
      name: t('common.partitions'),
      canJumpTo: topicData?.name.trim() !== '',
      component: (
        <StepPartitions topicData={topicData} setTopicData={setTopicData} />
      ),
    },
    {
      name: t('topic.message_retention'),
      canJumpTo: topicData?.name.trim() !== '',
      component: (
        <StepMessageRetention
          topicData={topicData}
          setTopicData={setTopicData}
        />
      ),
    },
    {
      name: t('common.replicas'),
      canJumpTo: topicData?.name.trim() !== '',
      component: (
        <StepReplicas
          replicationFactor={replicationFactor}
          minInSyncReplica={minInSyncReplicas}
          isMultiAZ={isMultiAZ}
        />
      ),
      nextButtonText: t('common.finish'),
    },
  ];

  const title = t('topic.wizard_title');

  const onValidate: IWizardFooter['onValidate'] = (onNext) => {
    if (topicData?.name.length < 1) {
      setInvalidText(t('topic.required'));
      setTopicNameValidated('error');
    } else if (topicData?.name === '.' || topicData?.name === '..') {
      setInvalidText(t('topic.invalid_name_with_dot'));
      setTopicNameValidated('error');
    } else {
      setIsLoading(true);
      fetchTopic(topicData?.name, onNext);
    }
  };

  return (
    <>
      {isSwitchChecked ? (
        <>
          <Divider className='kafka-ui--divider--FlexShrink' />
          <PageSection
            variant={PageSectionVariants.light}
            hasOverflowScroll={true}
          >
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
          hasOverflowScroll={true}
        >
          <Wizard
            navAriaLabel={`${title} steps`}
            mainAriaLabel={`${title} content`}
            steps={steps}
            onClose={closeWizard}
            onSave={saveTopic}
            data-testid='topicBasicCreate-Wizard'
            footer={
              <WizardCustomFooter
                isLoading={isLoading}
                onValidate={onValidate}
                topicNameValidated={topicNameValidated}
                closeWizard={closeWizard}
              />
            }
          />
        </PageSection>
      )}
    </>
  );
};
