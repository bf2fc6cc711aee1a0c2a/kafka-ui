import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionGroup,
  Button,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Stack,
  FormSection,
  TextContent,
  Text,
  TextVariants,
  TextInput,
  NumberInput,
  Form,
  Radio,
  PageSection,
  PageGroup,
} from '@patternfly/react-core';
import {
  DEFAULT_MESSAGE_TIMESTAMP_TYPE,
  DEFAULT_DELETE_RETENTION_TIME,
  DEFAULT_FILE_DELETE_DELAY,
  DEFAULT_INDEX_INTERVAL_SIZE,
  DEFAULT_LOG_SEGMENT_SIZE,
  DEFAULT_MAXIMUM_MESSAGE_BYTES,
  DEFAULT_MINIMUM_COMPACTION_LAG_TIME,
  DEFAULT_MIN_CLEANBLE_RATIO,
  DEFAULT_MIN_INSYNC_REPLICAS,
  DEFAULT_REPLICAS,
  DEFAULT_SEGMENT_INDEX_SIZE,
  DEFAULT_SEGMENT_JITTER_TIME,
  DEFAULT_SEGMENT_TIME,
  DEFAULT_MAX_MESSAGE_TIMESTAMP_DIFF,
  DEFAULT_FLUSH_INTERVAL_MESSAGES,
  DEFAULT_FLUSH_INTERVAL_TIME,
  MAX_PARTITIONS,
} from '@app/constant';
import {
  TextWithLabelPopover,
  FormGroupWithPopover,
  DropdownWithToggle,
  IDropdownOption,
} from '@app/components';
import {
  kebabToCamel,
  kebabToDotSeparated,
  IAdvancedTopic,
} from '@app/modules/Topics/utils';
import { getTopic } from '@app/services';
import { ConfigContext } from '@app/contexts';
import '../CreateTopicWizard/CreateTopicWizard.css';
import { isAxiosError } from '@app/utils/axios';
import { ModalType, useModal } from '@rhoas/app-services-ui-shared';
import { CustomRetentionMessage } from '@app/modules/Topics/components';
import {
  retentionTimeSelectOptions,
  retentionSizeSelectOptions,
  RetentionTimeUnits,
  RetentionSizeUnits,
  RetentionTimeUnitToValue,
  unitsToBytes as RetentionSizeUnitToValue,
  useValidateTopic,
} from '@app/modules/Topics/utils';

export type TopicAdvanceConfigProps = {
  isCreate: boolean;
  saveTopic: () => void;
  handleCancel?: () => void;
  topicData: IAdvancedTopic;
  setTopicData: (val: IAdvancedTopic) => void;
  isLoadingSave?: boolean;
};

export const TopicAdvanceConfig: React.FunctionComponent<TopicAdvanceConfigProps> =
  ({
    isCreate,
    saveTopic,
    handleCancel,
    topicData,
    setTopicData,
    isLoadingSave,
  }) => {
    const { showModal } = useModal<ModalType.KafkaUpdatePartitions>();
    const { t } = useTranslation();
    const actionText = isCreate ? t('topic.create_topic') : t('common.save');
    const { validateName } = useValidateTopic();

    //states
    const [topicValidated, setTopicValidated] = useState<'error' | 'default'>(
      'default'
    );
    const [invalidText, setInvalidText] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [partitionsValidated, setPartitionsValidated] = useState<
      'warning' | 'default'
    >('default');
    const [warning, setWarning] = useState<boolean>(false);
    const [initialPartition, setInitialPartition] = useState<
      number | undefined
    >(Number(topicData.numPartitions));
    useState<string>(topicData['retention.ms.unit'] || 'days');
    const [isRetentionTimeSelectOpen, setIsRetentionTimeSelectOpen] =
      useState<boolean>();
    const [isRetentionSizeSelectOpen, setIsRetentionSizeSelectOpen] =
      useState<boolean>();

    const cleanupPolicyOptions: IDropdownOption[] = [
      {
        key: 'compact',
        value: 'compact',
        label: t('common.compact'),
        isDisabled: false,
      },
      {
        key: 'delete',
        value: 'delete',
        label: t('common.delete'),
        isDisabled: false,
      },
      {
        key: 'compact-delete',
        value: 'compact, delete',
        label: `${t('common.compact')}, ${t('common.delete')}`,
        isDisabled: false,
      },
    ];

    //use effects
    useEffect(() => {
      if (!isCreate) {
        fetchTopic(topicData.name);
      }
      validationCheck(topicData.name);

      setTopicData({
        ...topicData,
        selectedRetentionTimeOption: RetentionSizeUnits.CUSTOM,
      });
    }, []);

    useEffect(() => {
      setTopicData({
        ...topicData,
        selectedRetentionTimeOption: RetentionTimeUnits.CUSTOM,
      });
    }, [topicData['retention.ms']]);

    useEffect(() => {
      setTopicData({
        ...topicData,
        selectedRetentionSizeOption: RetentionSizeUnits.CUSTOM,
      });
    }, [topicData['retention.bytes']]);

    const config = useContext(ConfigContext);
    const fetchTopic = async (topicName) => {
      try {
        const topicRes = await getTopic(topicName, config);
        if (topicRes) {
          if (isCreate) {
            setInvalidText(t('topic.already_exists', { name: topicName }));
            setTopicValidated('error');
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
          setTopicValidated('default');
          setIsLoading(false);
          saveTopic();
        }
      }
    };

    const validationCheck = (value: string) => {
      const errorMessage = validateName(value);
      if (errorMessage) {
        setInvalidText(errorMessage);
        setTopicValidated('error');
      } else {
        setTopicValidated('default');
      }
    };

    const partitionsWarnigCheckPlus = () => {
      if (
        initialPartition &&
        Number(topicData.numPartitions + 1) > initialPartition
      ) {
        setPartitionsValidated('warning');
        setWarning(true);
      } else {
        setPartitionsValidated('default');
        setWarning(false);
      }
    };

    const handleTextInputChange = (
      value: string,
      event: React.FormEvent<HTMLInputElement>
    ) => {
      validationCheck(value);
      const { name: fieldName } = event.currentTarget;
      setTopicData({ ...topicData, [kebabToCamel(fieldName)]: value });
    };

    const onPartitionsChange = (event: React.FormEvent<HTMLInputElement>) => {
      const { name: fieldName, value } = event.currentTarget;
      let partitionValue = Number(value);
      if (initialPartition) {
        if (partitionValue > initialPartition) {
          setPartitionsValidated('warning');
          setWarning(true);
        }

        if (partitionValue < initialPartition) {
          partitionValue = initialPartition;
          setPartitionsValidated('default');
          setWarning(false);
        } else if (partitionValue > MAX_PARTITIONS) {
          partitionValue = MAX_PARTITIONS;
        }
      }
      setTopicData({ ...topicData, [kebabToCamel(fieldName)]: partitionValue });
    };

    const handleTouchSpinPlusCamelCase = (event) => {
      const { name } = event.currentTarget;
      const fieldName = kebabToCamel(name);
      setTopicData({
        ...topicData,
        [fieldName]: Number(topicData[fieldName]) + 1,
      });
      if (!isCreate) {
        partitionsWarnigCheckPlus();
      }
    };

    const partitionsWarningCheckMinus = () => {
      if (
        initialPartition &&
        Number(topicData.numPartitions + -1) > initialPartition
      ) {
        setPartitionsValidated('warning');
        setWarning(true);
      } else {
        setPartitionsValidated('default');
        setWarning(false);
      }
    };

    const handleTouchSpinMinusCamelCase = (event) => {
      const { name } = event.currentTarget;
      const fieldName = kebabToCamel(name);
      setTopicData({
        ...topicData,
        [fieldName]: Number(topicData[fieldName]) - 1,
      });
      if (!isCreate) {
        partitionsWarningCheckMinus();
      }
    };

    const onDropdownChangeDotSeparated = (value: string, event) => {
      const { name: fieldName } = event.target;
      setTopicData({ ...topicData, [kebabToDotSeparated(fieldName)]: value });
    };

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
          setTopicValidated('error');
        } else {
          setIsLoading(true);
          fetchTopic(topicData.name);
        }
      }
    };

    const handleRetentionMessageTime = (value: string) => {
      setTopicData({
        ...topicData,
        'retention.ms':
          value === RetentionTimeUnits.UNLIMITED ||
          value === RetentionTimeUnits.CUSTOM
            ? topicData['retention.ms']
            : RetentionTimeUnitToValue[value],
        selectedRetentionTimeOption: value,
      });
    };

    const handleRetentionMessageSize = (value: string) => {
      setTopicData({
        ...topicData,
        'retention.bytes':
          value === RetentionSizeUnits.UNLIMITED ||
          value === RetentionSizeUnits.CUSTOM
            ? topicData['retention.bytes']
            : RetentionSizeUnitToValue[value],
        selectedRetentionSizeOption: value,
      });
    };

    const onRetentionTimeToggle = (isOpen: boolean) => {
      setIsRetentionTimeSelectOpen(isOpen);
    };

    const onRetentionSizeToggle = (isOpen: boolean) => {
      setIsRetentionSizeSelectOpen(isOpen);
    };

    const retentionTimeInput = (
      <CustomRetentionMessage
        toggleId='core-config-retention-dropdowntoggle'
        name='retention-ms'
        topicData={topicData}
        setTopicData={setTopicData}
        onToggle={onRetentionTimeToggle}
        isOpen={isRetentionTimeSelectOpen}
        selectOptions={retentionTimeSelectOptions}
      />
    );

    const retentionSizeInput = (
      <CustomRetentionMessage
        toggleId='core-config-retention-size-dropdowntoggle'
        name='retention-bytes'
        topicData={topicData}
        setTopicData={setTopicData}
        onToggle={onRetentionSizeToggle}
        isOpen={isRetentionSizeSelectOpen}
        selectOptions={retentionSizeSelectOptions}
      />
    );

    return (
      <PageSection padding={{ default: 'noPadding' }}>
        <Sidebar hasGutter>
          <SidebarPanel variant='sticky'>
            <JumpLinks
              isVertical
              label={t('topic.jump_to_section')}
              scrollableSelector='.app-services-ui--u-display-contents > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)'
              style={{ position: 'sticky' }}
              offset={-164} // for header
            >
              <JumpLinksItem key={0} href='#core-configuration'>
                {t('topic.core_configuration')}
              </JumpLinksItem>
              <JumpLinksItem key={1} href='#messages'>
                {t('topic.messages')}
              </JumpLinksItem>
              <JumpLinksItem key={2} href='#log'>
                {t('topic.log')}
              </JumpLinksItem>
              <JumpLinksItem key={3} href='#replication'>
                {t('topic.replication')}
              </JumpLinksItem>
              <JumpLinksItem key={4} href='#cleanup'>
                {t('common.cleanup')}
              </JumpLinksItem>
              <JumpLinksItem key={5} href='#index'>
                {t('topic.index')}
              </JumpLinksItem>
              <JumpLinksItem key={6} href='#flush'>
                {t('topic.flush')}
              </JumpLinksItem>
            </JumpLinks>
          </SidebarPanel>
          <SidebarContent>
            <PageGroup hasOverflowScroll id='topic-detail-view'>
              <PageSection padding={{ default: 'noPadding' }}>
                <Form>
                  <FormSection
                    title={t('topic.core_configuration')}
                    id='core-configuration'
                    titleElement={'h2'}
                  >
                    <TextContent>
                      <Text component={TextVariants.p} className='section-info'>
                        {t('topic.core_config_info')}
                      </Text>
                    </TextContent>
                    {isCreate ? (
                      <FormGroupWithPopover
                        labelHead={t('topic.topic_name')}
                        fieldId='create-topic-name'
                        fieldLabel={t('topic.topic_name')}
                        labelBody={t('topic.topic_name_description')}
                        buttonAriaLabel='More info for topic name field'
                        helperTextInvalid={invalidText}
                        validated={topicValidated}
                        isRequired={true}
                        helperText={t('topic.topic_name_helper_text')}
                      >
                        <TextInput
                          isRequired
                          type='text'
                          id='create-topic-name'
                          name='name'
                          value={topicData.name}
                          onChange={handleTextInputChange}
                          label={t('topic.topic_name')}
                          placeholder={t('topic.enter_name')}
                          validated={topicValidated}
                        />
                      </FormGroupWithPopover>
                    ) : (
                      <TextWithLabelPopover
                        fieldId='topic-name'
                        btnAriaLabel='topic detail name'
                        fieldLabel='Name'
                        fieldValue={topicData.name}
                        popoverBody={t('topic.topic_name_description')}
                        popoverHeader={t('topic.topic_name')}
                      />
                    )}

                    <FormGroupWithPopover
                      fieldId='create-topic-partitions'
                      fieldLabel='Partitions'
                      labelHead={t('topic.partitions')}
                      labelBody={t('topic.partitions_description')}
                      buttonAriaLabel='More info for partitions field'
                      validated={partitionsValidated}
                      helperText={
                        warning ? t('topic.partitions_warning') : undefined
                      }
                    >
                      <NumberInput
                        id='create-topic-partitions'
                        inputName='num-partitions'
                        onChange={onPartitionsChange}
                        onPlus={handleTouchSpinPlusCamelCase}
                        onMinus={handleTouchSpinMinusCamelCase}
                        value={Number(topicData.numPartitions)}
                        plusBtnProps={{ name: 'num-partitions' }}
                        minusBtnProps={{ name: 'num-partitions' }}
                        min={initialPartition}
                        max={MAX_PARTITIONS}
                      />
                    </FormGroupWithPopover>

                    <TextWithLabelPopover
                      fieldId='replicas'
                      btnAriaLabel={t('topic.replicas')}
                      fieldLabel={t('topic.replicas')}
                      fieldValue={
                        isCreate
                          ? DEFAULT_REPLICAS
                          : topicData.replicationFactor
                      }
                      popoverBody={t('topic.replicas_description')}
                      popoverHeader={t('topic.replicas')}
                    />
                    <TextWithLabelPopover
                      fieldId='min-insync-replicas'
                      btnAriaLabel='topic detail min-in-sync replica'
                      fieldLabel='Minimum in-sync replicas'
                      fieldValue={DEFAULT_MIN_INSYNC_REPLICAS}
                      popoverBody={t('topic.min_insync_replicas_description')}
                      popoverHeader={t('topic.min_insync_replicas')}
                    />
                    <FormGroupWithPopover
                      fieldId='retention'
                      fieldLabel='Retention time'
                      labelHead={t('topic.retention_time')}
                      labelBody={t('topic.retention_time_description')}
                      buttonAriaLabel='More info for retention time field'
                    >
                      <Stack hasGutter>
                        <Radio
                          isChecked={
                            topicData.selectedRetentionTimeOption ===
                            RetentionTimeUnits.CUSTOM
                          }
                          name='custom-retention-time'
                          onChange={() =>
                            handleRetentionMessageTime(
                              RetentionTimeUnits.CUSTOM
                            )
                          }
                          label={retentionTimeInput}
                          className='kafka-ui--radio-label__number-input'
                          aria-label='custom duration'
                          id='custom-retention-time'
                          value={RetentionTimeUnits.CUSTOM}
                        />
                        <Radio
                          isChecked={
                            topicData.selectedRetentionTimeOption ===
                            RetentionTimeUnits.UNLIMITED
                          }
                          name='unlimited-retention-time'
                          onChange={() =>
                            handleRetentionMessageTime(
                              RetentionTimeUnits.UNLIMITED
                            )
                          }
                          label='Unlimited'
                          aria-label='Unlimited'
                          id='unlimited-retention-time'
                          value={RetentionTimeUnits.UNLIMITED}
                        />
                      </Stack>
                    </FormGroupWithPopover>
                    <FormGroupWithPopover
                      fieldId='retention-size'
                      fieldLabel='Retention size'
                      labelHead={t('topic.retention_size')}
                      labelBody={t('topic.retention_size_description')}
                      buttonAriaLabel='More info for retention size field'
                    >
                      <Stack hasGutter>
                        <Radio
                          isChecked={
                            topicData.selectedRetentionSizeOption ===
                            RetentionSizeUnits.CUSTOM
                          }
                          name='custom-retention-size'
                          onChange={() =>
                            handleRetentionMessageSize(
                              RetentionSizeUnits.CUSTOM
                            )
                          }
                          label={retentionSizeInput}
                          className='kafka-ui--radio-label__number-input'
                          aria-label='custom size'
                          id='custom-retention-size'
                          value={RetentionSizeUnits.CUSTOM}
                        />
                        <Radio
                          isChecked={
                            topicData.selectedRetentionSizeOption ===
                            RetentionSizeUnits.UNLIMITED
                          }
                          name='unlimited-retention-size'
                          onChange={() =>
                            handleRetentionMessageSize(
                              RetentionSizeUnits.UNLIMITED
                            )
                          }
                          label='Unlimited'
                          aria-label='Unlimited'
                          id='unlimited-retention-size'
                          value={RetentionSizeUnits.UNLIMITED}
                        />
                      </Stack>
                    </FormGroupWithPopover>
                  </FormSection>
                  <FormSection
                    title={t('topic.messages')}
                    id='messages'
                    titleElement={'h2'}
                  >
                    <TextContent>
                      <Text component={TextVariants.p} className='section-info'>
                        {t('topic.message_section_info')}
                      </Text>
                    </TextContent>

                    <TextWithLabelPopover
                      fieldId='max-message-size'
                      btnAriaLabel={t('topic.max_message_size')}
                      fieldLabel={t('topic.max_message_size')}
                      fieldValue={DEFAULT_MAXIMUM_MESSAGE_BYTES}
                      popoverBody={t('topic.max_message_size_description')}
                      popoverHeader={t('topic.max_message_size')}
                    />

                    <TextWithLabelPopover
                      fieldId='message-timestamp-type'
                      btnAriaLabel={t('topic.message_timestamp_type')}
                      fieldLabel={t('topic.message_timestamp_type')}
                      fieldValue={DEFAULT_MESSAGE_TIMESTAMP_TYPE}
                      popoverBody={t(
                        'topic.message_timestamp_type_description'
                      )}
                      popoverHeader={t('topic.message_timestamp_type')}
                    />

                    <TextWithLabelPopover
                      fieldId='max-message-timestamp-diff'
                      btnAriaLabel={t('topic.max_message_timestamp_diff')}
                      fieldLabel={t('topic.max_message_timestamp_diff')}
                      fieldValue={DEFAULT_MAX_MESSAGE_TIMESTAMP_DIFF}
                      popoverBody={t(
                        'topic.max_message_timestamp_diff_description'
                      )}
                      popoverHeader={t('topic.max_message_timestamp_diff')}
                    />

                    <TextWithLabelPopover
                      fieldId='compression-type'
                      btnAriaLabel={t('topic.compression_type')}
                      fieldLabel={t('topic.compression_type')}
                      fieldValue={'Producer'}
                      popoverBody={t('topic.compression_type_description')}
                      popoverHeader={t('topic.compression_type')}
                    />

                    <TextWithLabelPopover
                      fieldId='message-format'
                      btnAriaLabel={t('topic.message_format')}
                      fieldLabel={t('topic.message_format')}
                      fieldValue={'2.7-IV2'}
                      popoverBody={t('topic.message_format_description')}
                      popoverHeader={t('topic.message_format')}
                    />
                  </FormSection>

                  <FormSection
                    title={t('topic.log')}
                    id='log'
                    titleElement={'h2'}
                  >
                    <TextContent>
                      <Text component={TextVariants.p}>
                        {t('topic.log_section_info')}
                      </Text>
                      <Text component={TextVariants.small}>
                        {t('topic.log_section_info_note')}
                      </Text>
                    </TextContent>

                    <FormGroupWithPopover
                      fieldId='cleanup-policy'
                      fieldLabel={t('topic.cleanup_policy')}
                      labelHead={t('topic.cleanup_policy')}
                      labelBody={t('topic.cleanup_policy_description')}
                      buttonAriaLabel={t('topic.cleanup_policy')}
                    >
                      <DropdownWithToggle
                        id='log-section-policy-type-dropdown'
                        toggleId='log-section-policy-type-dropdowntoggle'
                        ariaLabel={t('common.select_policy')}
                        onSelectOption={onDropdownChangeDotSeparated}
                        items={cleanupPolicyOptions}
                        name='cleanup-policy'
                        value={topicData['cleanup.policy'] || ''}
                      />
                    </FormGroupWithPopover>

                    <TextWithLabelPopover
                      fieldId='delete-retention-time'
                      btnAriaLabel={t('topic.delete_retention_time')}
                      fieldLabel={t('topic.delete_retention_time')}
                      fieldValue={DEFAULT_DELETE_RETENTION_TIME}
                      popoverBody={t('topic.delete_retention_time_description')}
                      popoverHeader={t('topic.delete_retention_time')}
                    />

                    <TextWithLabelPopover
                      fieldId='min-cleanable-ratio'
                      btnAriaLabel={t('topic.min_cleanable_ratio')}
                      fieldLabel={t('topic.min_cleanable_ratio')}
                      fieldValue={DEFAULT_MIN_CLEANBLE_RATIO}
                      popoverBody={t('topic.min_cleanable_ratio_description')}
                      popoverHeader={t('topic.min_cleanable_ratio')}
                    />

                    <TextWithLabelPopover
                      fieldId='min-compaction-lag-time-description'
                      btnAriaLabel={t('topic.min_compaction_lag_time')}
                      fieldLabel={t('topic.min_compaction_lag_time')}
                      fieldValue={DEFAULT_MINIMUM_COMPACTION_LAG_TIME}
                      popoverBody={t(
                        'topic.min_compaction_lag_time_description'
                      )}
                      popoverHeader={t('topic.min_compaction_lag_time')}
                    />
                  </FormSection>

                  <FormSection
                    title={t('topic.replication')}
                    id='replication'
                    titleElement={'h2'}
                  >
                    <TextContent>
                      <Text component={TextVariants.p}>
                        {t('topic.replication_section_info')}
                        <Text component={TextVariants.small}>
                          {t('topic.replication_section_info_note')}
                        </Text>
                      </Text>
                    </TextContent>

                    <TextWithLabelPopover
                      fieldId='unclean-leader-election'
                      btnAriaLabel={t('topic.unclean_leader_election')}
                      fieldLabel={t('topic.unclean_leader_election')}
                      fieldValue={t('common.disabled')}
                      popoverBody={t(
                        'topic.unclean_leader_election_description'
                      )}
                      popoverHeader={t('topic.unclean_leader_election')}
                    />
                  </FormSection>

                  <FormSection
                    title={t('common.cleanup')}
                    id='cleanup'
                    titleElement={'h2'}
                  >
                    <TextContent>
                      <Text component={TextVariants.p} className='section-info'>
                        {t('topic.cleanup_section_info')}
                      </Text>
                    </TextContent>

                    <TextWithLabelPopover
                      fieldId='log-segment-size'
                      btnAriaLabel={t('topic.log_segment_size')}
                      fieldLabel={t('topic.log_segment_size')}
                      fieldValue={DEFAULT_LOG_SEGMENT_SIZE}
                      popoverBody={t('topic.log_segment_size')}
                      popoverHeader={t('topic.log_segment_size_description')}
                    />

                    <TextWithLabelPopover
                      fieldId='segement-time'
                      btnAriaLabel={t('topic.segement_time')}
                      fieldLabel={t('topic.segement_time')}
                      fieldValue={DEFAULT_SEGMENT_TIME}
                      popoverBody={t('topic.segement_time_description')}
                      popoverHeader={t('topic.segement_time')}
                    />

                    <TextWithLabelPopover
                      fieldId='segment-jitter-time'
                      btnAriaLabel={t('topic.segment_jitter_time')}
                      fieldLabel={t('topic.segment_jitter_time')}
                      fieldValue={DEFAULT_SEGMENT_JITTER_TIME}
                      popoverBody={t('topic.segment_jitter_time_description')}
                      popoverHeader={t('topic.segment_jitter_time')}
                    />

                    <TextWithLabelPopover
                      fieldId='file-delete-delay'
                      btnAriaLabel={t('topic.file_delete_delay')}
                      fieldLabel={t('topic.file_delete_delay')}
                      fieldValue={DEFAULT_FILE_DELETE_DELAY}
                      popoverBody={t('topic.file_delete_delay_description')}
                      popoverHeader={t('topic.file_delete_delay')}
                    />

                    <TextWithLabelPopover
                      fieldId='preallocate-log-segment-files'
                      btnAriaLabel={t('topic.preallocate_log_segment_files')}
                      fieldLabel={t('topic.preallocate_log_segment_files')}
                      fieldValue={t('common.disabled')}
                      popoverBody={t(
                        'topic.preallocate_log_segment_files_description'
                      )}
                      popoverHeader={t('topic.preallocate_log_segment_files')}
                    />
                  </FormSection>

                  <FormSection
                    title={t('topic.index')}
                    id='index'
                    titleElement={'h2'}
                  >
                    <TextContent>
                      <Text component={TextVariants.p} className='section-info'>
                        {t('topic.index_section_info')}
                      </Text>
                    </TextContent>

                    <TextWithLabelPopover
                      fieldId='index-interval-size'
                      btnAriaLabel={t('topic.index_interval_size')}
                      fieldLabel={t('topic.index_interval_size')}
                      fieldValue={DEFAULT_INDEX_INTERVAL_SIZE}
                      popoverBody={t('topic.index_interval_size_description')}
                      popoverHeader={t('topic.index_interval_size')}
                    />

                    <TextWithLabelPopover
                      fieldId='segment-index-size'
                      btnAriaLabel={t('topic.segment_index_size')}
                      fieldLabel={t('topic.segment_index_size')}
                      fieldValue={DEFAULT_SEGMENT_INDEX_SIZE}
                      popoverBody={t('topic.segment_index_size_description')}
                      popoverHeader={t('topic.segment_index_size')}
                    />
                  </FormSection>

                  <FormSection
                    title={t('topic.flush')}
                    id='flush'
                    titleElement={'h2'}
                  >
                    <TextContent>
                      <Text component={TextVariants.p} className='section-info'>
                        {t('topic.flush_section_info')}
                      </Text>
                    </TextContent>

                    <TextWithLabelPopover
                      fieldId='flush-interval-messages'
                      btnAriaLabel={t('topic.flush_interval_messages')}
                      fieldLabel={t('topic.flush_interval_messages')}
                      fieldValue={DEFAULT_FLUSH_INTERVAL_MESSAGES}
                      popoverBody={t(
                        'topic.flush_interval_messages_description'
                      )}
                      popoverHeader={t('topic.flush_interval_messages')}
                    />

                    <TextWithLabelPopover
                      fieldId='flush-interval-time'
                      btnAriaLabel={t('topic.flush_interval_time')}
                      fieldLabel={t('topic.flush_interval_time')}
                      fieldValue={DEFAULT_FLUSH_INTERVAL_TIME}
                      popoverBody={t('topic.flush_interval_time_description')}
                      popoverHeader={t('topic.flush_interval_time')}
                    />
                  </FormSection>
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
                    isDisabled={topicValidated === 'default' ? false : true}
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
