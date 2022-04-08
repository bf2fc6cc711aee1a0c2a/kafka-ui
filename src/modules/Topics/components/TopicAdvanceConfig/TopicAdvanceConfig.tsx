import React, { useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionGroup,
  Button,
  Sidebar,
  SidebarContent,
  Form,
  PageSection,
  PageGroup,
  ValidatedOptions,
} from '@patternfly/react-core';
import { IAdvancedTopic } from '@app/modules/Topics/utils';
import { getTopic } from '@app/services';
import { ConfigContext } from '@app/contexts';
import '../CreateTopicWizard/CreateTopicWizard.css';
import { isAxiosError } from '@app/utils/axios';
import { ModalType, useModal } from '@rhoas/app-services-ui-shared';
import { TopicAdvanceJumpLinks } from './TopicAdvanceJumpLinks';
import { CoreConfiguration } from './CoreConfiguration';
import { Message } from './Message';
import { Log } from './Log';
import { Replication } from './Replication';
import { Cleanup } from './Cleanup';
import { TopicAdvanceIndex } from './TopicAdvanceIndex';
import { Flush } from './Flush';

export type TopicAdvanceConfigProps = {
  isCreate: boolean;
  saveTopic: () => void;
  handleCancel?: () => void;
  topicData: IAdvancedTopic;
  setTopicData: (val: IAdvancedTopic) => void;
  isLoadingSave?: boolean;
};

export const TopicAdvanceConfig: React.FunctionComponent<
  TopicAdvanceConfigProps
> = ({
  isCreate,
  saveTopic,
  handleCancel,
  topicData,
  setTopicData,
  isLoadingSave,
}) => {
  const config = useContext(ConfigContext);
  const { showModal } = useModal<ModalType.KafkaUpdatePartitions>();
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const actionText = isCreate ? t('topic.create_topic') : t('common.save');

  //states
  const [topicValidated, setTopicValidated] = useState<ValidatedOptions>(
    ValidatedOptions.default
  );
  const [invalidText, setInvalidText] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const [initialPartition, setInitialPartition] = useState<number | undefined>(
    Number(topicData.numPartitions)
  );
  useState<string>(topicData['retention.ms.unit'] || 'days');

  const fetchTopic = useCallback(
    async (topicName: string) => {
      try {
        const topicRes = await getTopic(topicName, config);
        if (topicRes) {
          if (isCreate) {
            setInvalidText(t('topic.already_exists', { name: topicName }));
            setTopicValidated(ValidatedOptions.error);
            setIsLoading(false);
          } else {
            setInitialPartition(topicRes?.partitions?.length);
          }
        }
      } catch (err) {
        let code: number | undefined;
        if (err && isAxiosError(err)) {
          code = err.response?.data.code;
        }
        if (isCreate && code === 404) {
          setTopicValidated(ValidatedOptions.default);
          setIsLoading(false);
          saveTopic();
        }
      }
    },
    [t, isCreate, saveTopic, config]
  );

  const onConfirm = () => {
    if (!isCreate) {
      if (warning) {
        showModal(ModalType.KafkaUpdatePartitions, {
          onSaveTopic: saveTopic,
        });
      } else {
        saveTopic();
      }
    } else {
      if (topicData.name.length < 1) {
        setInvalidText(t('topic.required'));
        setTopicValidated(ValidatedOptions.error);
      } else {
        setIsLoading(true);
        fetchTopic(topicData.name);
      }
    }
  };

  return (
    <PageSection padding={{ default: 'noPadding' }}>
      <Sidebar hasGutter>
        <TopicAdvanceJumpLinks />
        <SidebarContent>
          <PageGroup hasOverflowScroll id='topic-detail-view'>
            <PageSection padding={{ default: 'noPadding' }}>
              <Form>
                <CoreConfiguration
                  isCreate={isCreate}
                  topicData={topicData}
                  setTopicData={setTopicData}
                  fetchTopic={fetchTopic}
                  initialPartition={initialPartition}
                  invalidText={invalidText}
                  setInvalidText={setInvalidText}
                  setTopicValidated={setTopicValidated}
                  topicValidated={topicValidated}
                  setWarning={setWarning}
                  warning={warning}
                />
                <Message />
                <Log topicData={topicData} setTopicData={setTopicData} />
                <Replication />
                <Cleanup />
                <TopicAdvanceIndex />
                <Flush />
              </Form>
              <ActionGroup className='kafka-ui--sticky-footer'>
                <Button
                  isLoading={isLoading || isLoadingSave}
                  onClick={onConfirm}
                  variant='primary'
                  data-testid={
                    isCreate
                      ? 'topicAdvanceCreate-actionCreate'
                      : 'tabProperties-actionSave'
                  }
                  isDisabled={topicValidated !== 'default'}
                >
                  {actionText}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant='link'
                  data-testid={
                    isCreate
                      ? 'topicAdvanceCreate-actionCancel'
                      : 'tabProperties-actionCancel'
                  }
                >
                  {t('common.cancel')}
                </Button>
              </ActionGroup>
            </PageSection>
          </PageGroup>
        </SidebarContent>
      </Sidebar>
    </PageSection>
  );
};
