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
  SizeTimeFormGroup,
  DropdownWithToggle,
  IDropdownOption,
} from '@app/components';
import { kebabToCamel, kebabToDotSeparated } from '@app/modules/Topics/utils';
import { IAdvancedTopic } from '@app/modules/Topics/components';
import { getTopic } from '@app/services';
import { ConfigContext } from '@app/contexts';
import '../CreateTopicWizard/CreateTopicWizard.css';
import { isAxiosError } from '@app/utils/axios';
import { ModalType, useModal } from '@rhoas/app-services-ui-shared';

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
    const { showModal } = useModal<ModalType.KafkaUpdatePartitions>();
    const { t } = useTranslation();

    const [isCustomRetentionTimeSelected, setIsCustomRetentionTimeSelected] =
      useState<boolean>(true);
    const [isCustomRetentionSizeSelected, setIsCustomRetentionSizeSelected] =
      useState<boolean>(false);

    const [customRetentionTime, setCustomRetentionTime] = useState<number>(7);
    const [customRetentionTimeUnit, setCustomRetentionTimeUnit] =
      useState<string>('days');
    const [customRetentionSize, setCustomRetentionSize] = useState<number>(1);
    const [customRetentionSizeUnit, setCustomRetentionSizeUnit] =
      useState<string>('bytes');
    const actionText = isCreate ? t('topic.create_topic') : t('common.save');

    const clearOptions: IDropdownOption[] = [
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

    useEffect(() => {
      if (!isCreate) {
        fetchTopic(topicData.name);
      }
      validationCheck(topicData.name);
      setCustomRetentionTimeUnit('milliseconds');
    }, []);

    useEffect(() => {
      if (!isCreate) {
        if (topicData['retention.bytes'] === '-1') {
          setIsCustomRetentionSizeSelected(false);
        } else {
          setIsCustomRetentionSizeSelected(true);
          setCustomRetentionSize(Number(topicData['retention.bytes']));
        }
        if (topicData['retention.ms'] === '-1') {
          setIsCustomRetentionTimeSelected(false);
        } else {
          setIsCustomRetentionTimeSelected(true);
          setCustomRetentionTime(Number(topicData['retention.ms']));
        }
      }
    }, [topicData['retention.bytes'], topicData['retention.ms']]);

    const validationCheck = (value: string) => {
      const legalNameChars = new RegExp('^[a-zA-Z0-9._-]+$');

      if (value.length && !legalNameChars.test(value)) {
        setInvalidText(t('topic.topic_name_helper_text'));
        setTopicValidated('error');
      } else if (value.length > 249) {
        setTopicValidated('error');
        setInvalidText(t('topic.cannot_exceed_characters'));
      } else if (value === '.' || value === '..') {
        setTopicValidated('error');
        setInvalidText(t('topic.invalid_name_with_dot'));
      } else setTopicValidated('default');
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

    const onDropdownChange = (value: string, event) => {
      const { name } = event.target;

      if (name === 'custom-retention-time-unit') {
        setCustomRetentionTimeUnit(value);
        isCustomRetentionTimeSelected &&
          setTopicData({
            ...topicData,
            'retention.ms.unit': value,
          });
      }
      if (name === 'custom-retention-size-unit') {
        setCustomRetentionSizeUnit(value);
        isCustomRetentionSizeSelected &&
          setTopicData({
            ...topicData,
            'retention.bytes.unit': value,
          });
      }
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

    const handleTouchSpinInputChange = (
      event: React.FormEvent<HTMLInputElement>
    ) => {
      const { name, value } = event.currentTarget;

      if (name === 'custom-retention-time') {
        setCustomRetentionTime(Number(value));
        isCustomRetentionTimeSelected &&
          setTopicData({
            ...topicData,
            'retention.ms': value,
          });
      } else if (name === 'custom-retention-size') {
        setCustomRetentionSize(Number(value));
        isCustomRetentionSizeSelected &&
          setTopicData({
            ...topicData,
            'retention.bytes': value,
          });
      }
    };

    const handleTouchSpinPlus = (event) => {
      const { name } = event.currentTarget;
      if (name === 'custom-retention-time') {
        const updatedRetentionTime = customRetentionTime + 1;
        setCustomRetentionTime(updatedRetentionTime);
        isCustomRetentionTimeSelected &&
          setTopicData({
            ...topicData,
            'retention.ms': updatedRetentionTime.toString(),
          });
      } else if (name === 'custom-retention-size') {
        const updatedRetentionSize = customRetentionSize + 1;
        setCustomRetentionSize(updatedRetentionSize);
        isCustomRetentionSizeSelected &&
          setTopicData({
            ...topicData,
            'retention.bytes': updatedRetentionSize.toString(),
          });
      }
    };

    const handleTouchSpinMinus = (event) => {
      const { name } = event.currentTarget;
      if (name === 'custom-retention-time') {
        const updatedRetentionTime = customRetentionTime - 1;
        setCustomRetentionTime(updatedRetentionTime);
        isCustomRetentionTimeSelected &&
          setTopicData({
            ...topicData,
            'retention.ms': updatedRetentionTime.toString(),
          });
      } else if (name === 'custom-retention-size') {
        const updatedRetentionSize = customRetentionSize - 1;
        setCustomRetentionSize(updatedRetentionSize);
        isCustomRetentionSizeSelected &&
          setTopicData({
            ...topicData,
            'retention.bytes': updatedRetentionSize.toString(),
          });
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

    const handleRadioChange = (_, event) => {
      const { name } = event.target;

      switch (name) {
        case 'custom-retention-time':
          setIsCustomRetentionTimeSelected(true);
          setTopicData({
            ...topicData,
            'retention.ms': customRetentionTime.toString(),
            'retention.ms.unit': customRetentionTimeUnit,
          });
          break;
        case 'unlimited-retention-time':
          setIsCustomRetentionTimeSelected(false);
          setTopicData({
            ...topicData,
            'retention.ms': '-1',
            'retention.ms.unit': 'milliseconds',
          });
          break;
        case 'custom-retention-size':
          setIsCustomRetentionSizeSelected(true);
          setTopicData({
            ...topicData,
            'retention.bytes': customRetentionSize.toString(),
            'retention.bytes.unit': customRetentionSizeUnit,
          });
          break;
        case 'unlimited-retention-size':
          setIsCustomRetentionSizeSelected(false);
          setTopicData({
            ...topicData,
            'retention.bytes': '-1',
            'retention.bytes.unit': 'bytes',
          });
          break;
      }
    };

    const retentionTimeInput = (
      <SizeTimeFormGroup
        inputName='custom-retention-time'
        onChange={handleTouchSpinInputChange}
        onPlus={handleTouchSpinPlus}
        onMinus={handleTouchSpinMinus}
        value={customRetentionTime}
        plusBtnProps={{ name: 'custom-retention-time' }}
        minusBtnProps={{ name: 'custom-retention-time' }}
        id='core-config-retention-time-unit'
        toggleId='core-config-retention-dropdowntoggle'
        name='custom-retention-time-unit'
        dropdownValue={customRetentionTimeUnit}
        ariaLabel={t('common.select_unit')}
        onSelectOption={onDropdownChange}
        min={0}
        type='time'
      />
    );

    const retentionSizeInput = (
      <SizeTimeFormGroup
        inputName='custom-retention-size'
        onChange={handleTouchSpinInputChange}
        onPlus={handleTouchSpinPlus}
        onMinus={handleTouchSpinMinus}
        value={customRetentionSize}
        plusBtnProps={{ name: 'custom-retention-size' }}
        minusBtnProps={{ name: 'custom-retention-size' }}
        id='core-config-retention-size-unit'
        toggleId='core-config-retention-size-dropdowntoggle'
        name='custom-retention-size-unit'
        dropdownValue={customRetentionSizeUnit}
        ariaLabel={t('common.select_unit')}
        onSelectOption={onDropdownChange}
        min={0}
        type='memory'
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
                          isChecked={isCustomRetentionTimeSelected}
                          name='custom-retention-time'
                          onChange={handleRadioChange}
                          label={retentionTimeInput}
                          className='kafka-ui--radio-label__number-input'
                          aria-label='custom duration'
                          id='custom-retention-time'
                          value='custom'
                        />
                        <Radio
                          isChecked={!isCustomRetentionTimeSelected}
                          name='unlimited-retention-time'
                          onChange={handleRadioChange}
                          label='Unlimited'
                          aria-label='Unlimited'
                          id='unlimited-retention-time'
                          value='unlimited'
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
                          isChecked={isCustomRetentionSizeSelected}
                          name='custom-retention-size'
                          onChange={handleRadioChange}
                          label={retentionSizeInput}
                          className='kafka-ui--radio-label__number-input'
                          aria-label='custom size'
                          id='custom-retention-size'
                          value='custom'
                        />
                        <Radio
                          isChecked={!isCustomRetentionSizeSelected}
                          name='unlimited-retention-size'
                          onChange={handleRadioChange}
                          label='Unlimited'
                          aria-label='Unlimited'
                          id='unlimited-retention-size'
                          value='unlimited'
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
                        items={clearOptions}
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
