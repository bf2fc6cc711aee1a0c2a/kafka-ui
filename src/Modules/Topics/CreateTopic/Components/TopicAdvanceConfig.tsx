import React, { useState, useEffect, useContext } from 'react';
import {
  ActionGroup,
  Button,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Stack,
  StackItem,
  TextContent,
  Text,
  TextVariants,
  TextInput,
  NumberInput,
  Form,
  Radio,
} from '@patternfly/react-core';
import './CreateTopicWizard.css';

import { useTranslation } from 'react-i18next';
import { PartitionsChangeModal } from './PartitionsChangeModal';
import { TextWithLabelPopover } from '../../../../Components/TextWithLabelPopover/TextWithLabelPopover';
import { FormGroupWithPopover } from '../../../../Components/FormGroupWithPopover/FormGroupWithPopover';
import { SizeTimeFormGroup } from '../../../../Components/SizeTimeFormGroup/SizeTimeFormGroup';
import { kebabToCamel, kebabToDotSeparated } from '../utils';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../../../../Components/DropdownWithToggle';
import { IAdvancedTopic } from './CreateTopicWizard';

import { getTopic } from '../../../../Services/index';
import { ConfigContext } from '../../../../Contexts';

interface ITopicAdvanceConfig {
  isCreate: boolean;
  saveTopic: () => void;
  handleCancel: () => void;
  topicData: IAdvancedTopic;
  setTopicData: (val: IAdvancedTopic) => void;
}

export const TopicAdvanceConfig: React.FunctionComponent<ITopicAdvanceConfig> = ({
  isCreate,
  saveTopic,
  handleCancel,
  topicData,
  setTopicData,
}) => {
  const [partitionsValidated, setPartitionsValidated] = useState<
    'warning' | 'default'
  >('default');
  const [warning, setWarning] = useState<boolean>(false);
  const [initialPartition, setInitialPartition] = useState<number | undefined>(
    0
  );
  const [topicValidated, setTopicValidated] = useState<'error' | 'default'>(
    'default'
  );
  const [invalidText, setInvalidText] = useState('This is a required field');
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  const [
    isCustomRetentionTimeSelected,
    setIsCustomRetentionTimeSelected,
  ] = useState<boolean>(true);
  const [
    isCustomRetentionSizeSelected,
    setIsCustomRetentionSizeSelected,
  ] = useState<boolean>(false);

  const [customRetentionTime, setCustomRetentionTime] = useState<number>(7);
  const [
    customRetentionTimeUnit,
    setCustomRetentionTimeUnit,
  ] = useState<string>('days');
  const [customRetentionSize, setCustomRetentionSize] = useState<number>(1);
  const [
    customRetentionSizeUnit,
    setCustomRetentionSizeUnit,
  ] = useState<string>('bytes');
  const actionText =
    isCreate === true ? t('topic.create_topic') : t('common.save');

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
    {
      key: 'delete-compact',
      value: 'delete, compact',
      label: `${t('common.delete')}, ${t('common.compact')}`,
      isDisabled: false,
    },
  ];

  const config = useContext(ConfigContext);
  const fetchTopic = async (topicName) => {
    const topicRes = await getTopic(topicName, config);

    const configEntries: any = {};
    topicRes.config?.forEach((configItem) => {
      configEntries[configItem.key || ''] = configItem.value || '';
    });

    setInitialPartition(topicRes?.partitions?.length);
  };

  useEffect(() => {
    (async function () {
      fetchTopic(topicData.name);
    })();
    if (!isCreate) {
      setCustomRetentionTimeUnit('milliseconds');
    }
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
    const regexpInvalid = new RegExp('^[0-9A-Za-z_-]+$');

    if (value.length && !regexpInvalid.test(value)) {
      setInvalidText(
        'Invalid input. Only letters (Aa-Zz) , numbers " _ " and " - " are accepted'
      );
      setTopicValidated('error');
    } else if (value.length < 1) {
      setInvalidText('This is a required field');
      setTopicValidated('error');
    } else if (value.length > 249) {
      setTopicValidated('error');
      setInvalidText('Topic name cannot exceed 249 characters');
    } else setTopicValidated('default');
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
    setTopicData({ ...topicData, [kebabToCamel(fieldName)]: Number(value) });
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
    if (warning) setIsWarningOpen(true);
    else saveTopic();
  };
  const onSaveClick = () => {
    setIsWarningOpen(false);
    saveTopic();
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
    <>
      <Sidebar hasGutter>
        <SidebarPanel variant='sticky'>
          <JumpLinks
            isVertical
            label={t('topic.jump_to_section')}
            scrollableSelector='#scrollablePageMain'
            style={{ position: 'sticky' }}
            offset={-164} // for header
            expandable={{ default: 'expandable', md: 'nonExpandable' }}
            isExpanded={false}
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
          <PageSection
            className='kafka-ui--topics-advanced-config'
            padding={{ default: 'noPadding' }}
            hasOverflowScroll
            id='topic-advance-config-scroll-container'
          >
            <Stack hasGutter>
              <StackItem>
                <TextContent>
                  <Text
                    component={TextVariants.h2}
                    tabIndex={-1}
                    id='core-configuration'
                  >
                    {t('topic.core_configuration')}
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('topic.core_config_info')}
                  </Text>
                </TextContent>
                <Form>
                  {isCreate ? (
                    <FormGroupWithPopover
                      labelHead={t('topic.topic_name')}
                      fieldId='create-topic-name'
                      fieldLabel={t('topic.topic_name')}
                      labelBody={t('topic.topic_name_description')}
                      buttonAriaLabel='More info for topic name field'
                      helperTextInvalid={invalidText}
                      validated={topicValidated}
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
                      btnAriaLabel='topic detail name'
                      fieldLabel='Name'
                      fieldValue={topicData.name}
                      popoverBody={t('topic.topic_name_description')}
                      popoverHeader={t('topic.topic_name')}
                    />
                  )}
                  {isCreate ? (
                    <FormGroupWithPopover
                      fieldId='create-topic-partitions'
                      fieldLabel='Partitions'
                      labelHead={t('topic.partitions')}
                      labelBody={t('topic.partitions_description')}
                      buttonAriaLabel='More info for partitions field'
                      validated={partitionsValidated}
                      helperText={
                        warning
                          ? `Increasing a topic's partitions might result in messages having the same key from two different partitions, which can potentially break the message ordering guarantees that apply to a single partition`
                          : undefined
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
                        min={1}
                      />
                    </FormGroupWithPopover>
                  ) : (
                    <TextWithLabelPopover
                      btnAriaLabel='More info for partitions field'
                      fieldLabel='Partitions'
                      fieldValue={topicData.numPartitions}
                      popoverBody={t('topic.partitions_description')}
                      popoverHeader={t('topic.partitions')}
                    />
                  )}
                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.replicas')}
                    fieldLabel={t('topic.replicas')}
                    fieldValue={'3'}
                    popoverBody={t('topic.replicas_description')}
                    popoverHeader={t('topic.replicas')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail min-in-sync replica'
                    fieldLabel='Minimum in-sync replicas'
                    fieldValue={'2'}
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
                </Form>
              </StackItem>
              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='messages'>
                    {t('topic.messages')}
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('topic.message_section_info')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.max_message_size')}
                  fieldLabel={t('topic.max_message_size')}
                  fieldValue={'1048588'}
                  popoverBody={t('topic.max_message_size_description')}
                  popoverHeader={t('topic.max_message_size')}
                  unit={'bytes'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.message_timestamp_type')}
                  fieldLabel={t('topic.message_timestamp_type')}
                  fieldValue={'CreateTime'}
                  popoverBody={t('topic.message_timestamp_type_description')}
                  popoverHeader={t('topic.message_timestamp_type')}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.max_message_timestamp_diff')}
                  fieldLabel={t('topic.max_message_timestamp_diff')}
                  fieldValue={'9223372036854775807'}
                  popoverBody={t(
                    'topic.max_message_timestamp_diff_description'
                  )}
                  popoverHeader={t('topic.max_message_timestamp_diff')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.compression_type')}
                  fieldLabel={t('topic.compression_type')}
                  fieldValue={'Producer'}
                  popoverBody={t('topic.compression_type_description')}
                  popoverHeader={t('topic.compression_type')}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.message_format')}
                  fieldLabel={t('topic.message_format')}
                  fieldValue={'2.7-IV2'}
                  popoverBody={t('topic.message_format_description')}
                  popoverHeader={t('topic.message_format')}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='log'>
                    {t('topic.log')}
                  </Text>
                  <Text
                    component={TextVariants.p}
                    className='section-info-head'
                  >
                    {t('topic.log_section_info')}
                  </Text>
                  <Text
                    component={TextVariants.small}
                    className='section-info-note'
                  >
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
                  btnAriaLabel={t('topic.delete_retention_time')}
                  fieldLabel={t('topic.delete_retention_time')}
                  fieldValue={'86400000'}
                  popoverBody={t('topic.delete_retention_time_description')}
                  popoverHeader={t('topic.delete_retention_time')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.min_cleanable_ratio')}
                  fieldLabel={t('topic.min_cleanable_ratio')}
                  fieldValue={'0.5'}
                  popoverBody={t('topic.min_cleanable_ratio_description')}
                  popoverHeader={t('topic.min_cleanable_ratio')}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.min_compaction_lag_time')}
                  fieldLabel={t('topic.min_compaction_lag_time')}
                  fieldValue={'0'}
                  popoverBody={t('topic.min_compaction_lag_time_description')}
                  popoverHeader={t('topic.min_compaction_lag_time')}
                  unit={'ms'}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text
                    component={TextVariants.h2}
                    tabIndex={-1}
                    id='replication'
                  >
                    {t('topic.replication')}
                  </Text>
                  <Text
                    component={TextVariants.p}
                    className='section-info-head'
                  >
                    {t('topic.replication_section_info')}
                  </Text>
                  <Text
                    component={TextVariants.small}
                    className='section-info-note'
                  >
                    {t('topic.replication_section_info_note')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.unclean_leader_election')}
                  fieldLabel={t('topic.unclean_leader_election')}
                  fieldValue={'Disabled'}
                  popoverBody={t('topic.unclean_leader_election_description')}
                  popoverHeader={t('topic.unclean_leader_election')}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='cleanup'>
                    {t('common.cleanup')}
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('topic.cleanup_section_info')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.log_segment_size')}
                  fieldLabel={t('topic.log_segment_size')}
                  fieldValue={'1073741824'}
                  popoverBody={t('topic.log_segment_size')}
                  popoverHeader={t('topic.log_segment_size_description')}
                  unit={'bytes'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.segement_time')}
                  fieldLabel={t('topic.segement_time')}
                  fieldValue={'604800000'}
                  popoverBody={t('topic.segement_time_description')}
                  popoverHeader={t('topic.segement_time')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.segment_jitter_time')}
                  fieldLabel={t('topic.segment_jitter_time')}
                  fieldValue={'0'}
                  popoverBody={t('topic.segment_jitter_time_description')}
                  popoverHeader={t('topic.segment_jitter_time')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.file_delete_delay')}
                  fieldLabel={t('topic.file_delete_delay')}
                  fieldValue={'60000'}
                  popoverBody={t('topic.file_delete_delay_description')}
                  popoverHeader={t('topic.file_delete_delay')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.preallocate_log_segment_files')}
                  fieldLabel={t('topic.preallocate_log_segment_files')}
                  fieldValue={'Disabled'}
                  popoverBody={t(
                    'topic.preallocate_log_segment_files_description'
                  )}
                  popoverHeader={t('topic.preallocate_log_segment_files')}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='index'>
                    {t('topic.index')}
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('topic.index_section_info')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.index_interval_size')}
                  fieldLabel={t('topic.index_interval_size')}
                  fieldValue={'4096'}
                  popoverBody={t('topic.index_interval_size_description')}
                  popoverHeader={t('topic.index_interval_size')}
                  unit={'bytes'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.segment_index_size')}
                  fieldLabel={t('topic.segment_index_size')}
                  fieldValue={'10485760'}
                  popoverBody={t('topic.segment_index_size_description')}
                  popoverHeader={t('topic.segment_index_size')}
                  unit={'bytes'}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='flush'>
                    {t('topic.flush')}
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('topic.flush_section_info')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.flush_interval_messages')}
                  fieldLabel={t('topic.flush_interval_messages')}
                  fieldValue={'9223372036854775807'}
                  popoverBody={t('topic.flush_interval_messages_description')}
                  popoverHeader={t('topic.flush_interval_messages')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel={t('topic.flush_interval_time')}
                  fieldLabel={t('topic.flush_interval_time')}
                  fieldValue={'9223372036854775807'}
                  popoverBody={t('topic.flush_interval_time_description')}
                  popoverHeader={t('topic.flush_interval_time')}
                  unit={'ms'}
                />
              </StackItem>
            </Stack>
          </PageSection>
          <ActionGroup className='kafka-ui--sticky-footer'>
            <Button
              onClick={onConfirm}
              variant='primary'
              data-testid={
                isCreate
                  ? 'topicAdvanceCreate-actionCreate'
                  : 'tabProperties-actionSave'
              }
              isDisabled={
                topicData.name.length > 0 && topicValidated == 'default'
                  ? false
                  : true
              }
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
          {isWarningOpen && (
            <PartitionsChangeModal
              isWarningOpen={isWarningOpen}
              onSaveClick={onSaveClick}
              setIsWarningOpen={setIsWarningOpen}
            />
          )}
        </SidebarContent>
      </Sidebar>
    </>
  );
};
