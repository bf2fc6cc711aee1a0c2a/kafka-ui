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

  const actionText = isCreate === true ? 'Create Topic' : 'Save';

  const clearOptions: IDropdownOption[] = [
    { key: 'compact', value: 'compact', label: 'Compact', isDisabled: false },
    { key: 'delete', value: 'delete', label: 'Delete', isDisabled: false },
    {
      key: 'compact-delete',
      value: 'compact, delete',
      label: 'Compact, Delete',
      isDisabled: false,
    },
    {
      key: 'delete-compact',
      value: 'delete, compact',
      label: 'Delete, Compact',
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
    if(!isCreate) {
      setCustomRetentionTimeUnit('milliseconds');
    }
  }, []);

  useEffect(() => {
    if(!isCreate) {
      if(topicData['retention.bytes'] === '-1') {
        setIsCustomRetentionSizeSelected(false);
      } else {
        setIsCustomRetentionSizeSelected(true);
        setCustomRetentionSize(Number(topicData['retention.bytes']));
      }
      if(topicData['retention.ms'] === '-1') {
        setIsCustomRetentionTimeSelected(false);
      } else {
        setIsCustomRetentionTimeSelected(true);
        setCustomRetentionTime(Number(topicData['retention.ms']));
      }
    }
  }, [topicData['retention.bytes'], topicData['retention.ms']])

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
      ariaLabel='select unit from dropdown'
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
      ariaLabel='select unit from dropdown'
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
            label='JUMP TO SECTION'
            scrollableSelector='.pf-c-page__main:first-of-type'
            style={{ position: 'sticky' }}
            offset={-164} // for header
            expandable={{ default: 'expandable', md: 'nonExpandable' }}
            isExpanded={false}
          >
            <JumpLinksItem key={0} href='#core-configuration'>
              Core configuration
            </JumpLinksItem>
            <JumpLinksItem key={1} href='#messages'>
              Messages
            </JumpLinksItem>
            <JumpLinksItem key={2} href='#log'>
              Log
            </JumpLinksItem>
            <JumpLinksItem key={3} href='#replication'>
              Replication
            </JumpLinksItem>
            <JumpLinksItem key={4} href='#cleanup'>
              Cleanup
            </JumpLinksItem>
            <JumpLinksItem key={5} href='#index'>
              Index
            </JumpLinksItem>
            <JumpLinksItem key={6} href='#flush'>
              Flush
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
                    Core configuration
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('createTopic.coreConfigInfo')}
                  </Text>
                </TextContent>
                <Form>
                  {isCreate ? (
                    <FormGroupWithPopover
                      labelHead={t('createTopic.topicNameLabelHead')}
                      fieldId='create-topic-name'
                      fieldLabel='Topic name'
                      labelBody={t('createTopic.topicNameLabelBody')}
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
                        label='Topic name'
                        placeholder='Enter topic name'
                        validated={topicValidated}
                      />
                    </FormGroupWithPopover>
                  ) : (
                    <TextWithLabelPopover
                      btnAriaLabel='topic detail name'
                      fieldLabel='Name'
                      fieldValue={topicData.name}
                      popoverBody={t('createTopic.topicNameLabelBody')}
                      popoverHeader={t('createTopic.topicNameLabelHead')}
                    />
                  )}
                  { isCreate ? (<FormGroupWithPopover
                    fieldId='create-topic-partitions'
                    fieldLabel='Partitions'
                    labelHead={t('createTopic.partitionsLabelHead')}
                    labelBody={t('createTopic.partitionsLabelBody')}
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
                  </FormGroupWithPopover>) : (<TextWithLabelPopover
                    btnAriaLabel='More info for partitions field'
                    fieldLabel='Partitions'
                    fieldValue={topicData.numPartitions}
                    popoverBody={t('createTopic.partitionsLabelBody')}
                    popoverHeader={t('createTopic.partitionsLabelHead')}
                  />) }
                  <TextWithLabelPopover
                    btnAriaLabel='topic detail replicas'
                    fieldLabel='Replicas'
                    fieldValue={'3'}
                    popoverBody={t('createTopic.replicasLabelBody')}
                    popoverHeader={t('createTopic.replicasLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail min-in-sync replica'
                    fieldLabel='Minimum in-sync replicas'
                    fieldValue={'2'}
                    popoverBody={t('createTopic.inSyncReplicasLabelBody')}
                    popoverHeader={t('createTopic.inSyncReplicasLabelHead')}
                  />
                  <FormGroupWithPopover
                    fieldId='retention'
                    fieldLabel='Retention time'
                    labelHead={t('createTopic.retentionTimeLabelHead')}
                    labelBody={t('createTopic.retentionTimeLabelBody')}
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
                    labelHead={t('createTopic.retentionBytesLabelHead')}
                    labelBody={t('createTopic.retentionBytesLabelBody')}
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
                    Messages
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('createTopic.messageSectionInfo')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel='topic detail max message bytes'
                  fieldLabel='Maximum message bytes'
                  fieldValue={'1048588'}
                  popoverBody={t('createTopic.maxMessageSizeLabelBody')}
                  popoverHeader={t('createTopic.maxMessageSizeLabelHead')}
                  unit={'bytes'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='topic detail message timestamp type'
                  fieldLabel='Message timestamp type'
                  fieldValue={'CreateTime'}
                  popoverBody={t('createTopic.messageTimestampLabelBody')}
                  popoverHeader={t('createTopic.messageTimestampLabelHead')}
                />

                <TextWithLabelPopover
                  btnAriaLabel='topic detail message timestamp difference'
                  fieldLabel='Maximum message timestamp difference'
                  fieldValue={'9223372036854775807'}
                  popoverBody={t('createTopic.messageTimestampDiffLabelBody')}
                  popoverHeader={t('createTopic.messageTimestampDiffLabelHead')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='topic detail compression type'
                  fieldLabel='Compression type'
                  fieldValue={'Producer'}
                  popoverBody={t('createTopic.compressionTypeLabelBody')}
                  popoverHeader={t('createTopic.compressionTypeLabelHead')}
                />

                <TextWithLabelPopover
                  btnAriaLabel='topic detail message format version'
                  fieldLabel='Message format version'
                  fieldValue={'2.7-IV2'}
                  popoverBody={t('createTopic.messageFormatLabelBody')}
                  popoverHeader={t('createTopic.messageFormatLabelHead')}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='log'>
                    Log
                  </Text>
                  <Text
                    component={TextVariants.p}
                    className='section-info-head'
                  >
                    {t('createTopic.logSectionInfo')}
                  </Text>
                  <Text
                    component={TextVariants.small}
                    className='section-info-note'
                  >
                    {t('createTopic.logSectionInfoNote')}
                  </Text>
                </TextContent>

                <FormGroupWithPopover
                  fieldId='cleanup-policy'
                  fieldLabel='Cleanup policy'
                  labelHead={t('createTopic.cleanupPolicyLabelHead')}
                  labelBody={t('createTopic.cleanupPolicyLabelBody')}
                  buttonAriaLabel='More info for cleanup policy field'
                >
                  <DropdownWithToggle
                    id='log-section-policy-type-dropdown'
                    toggleId='log-section-policy-type-dropdowntoggle'
                    ariaLabel='select policy type from dropdown'
                    onSelectOption={onDropdownChangeDotSeparated}
                    items={clearOptions}
                    name='cleanup-policy'
                    value={topicData['cleanup.policy'] || ''}
                  />
                </FormGroupWithPopover>

                <TextWithLabelPopover
                  btnAriaLabel='topic detail retention bytes'
                  fieldLabel='Delete retention time'
                  fieldValue={'86400000'}
                  popoverBody={t('createTopic.deleteRetentionLabelBody')}
                  popoverHeader={t('createTopic.deleteRetentionLabelHead')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='topic detail min cleanable dirty ratio'
                  fieldLabel='Minimum cleanable dirty ratio'
                  fieldValue={'0.5'}
                  popoverBody={t('createTopic.minRatioLabelBody')}
                  popoverHeader={t('createTopic.minRatioLabelHead')}
                />

                <TextWithLabelPopover
                  btnAriaLabel='topic detail min compaction lag time'
                  fieldLabel='Minimum compaction lag time'
                  fieldValue={'0'}
                  popoverBody={t('createTopic.minLagLabelBody')}
                  popoverHeader={t('createTopic.minLagLabelHead')}
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
                    Replication
                  </Text>
                  <Text
                    component={TextVariants.p}
                    className='section-info-head'
                  >
                    {t('createTopic.replicationSectionInfo')}
                  </Text>
                  <Text
                    component={TextVariants.small}
                    className='section-info-note'
                  >
                    {t('createTopic.replicationSectionInfoNote')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel='topic detail unclean leader election'
                  fieldLabel='Unclean leader election'
                  fieldValue={'Disabled'}
                  popoverBody={t('createTopic.leaderElectionLabelBody')}
                  popoverHeader={t('createTopic.leaderElectionLabelHead')}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='cleanup'>
                    Cleanup
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('createTopic.cleanupSectionInfo')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel='topic detail log segment bytes'
                  fieldLabel='Log segment size'
                  fieldValue={'1073741824'}
                  popoverBody={t('createTopic.logSegmentLabelHead')}
                  popoverHeader={t('createTopic.logSegmentLabelBody')}
                  unit={'bytes'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='segment time'
                  fieldLabel='Segment time'
                  fieldValue={'604800000'}
                  popoverBody={t('createTopic.segementTimeLabelBody')}
                  popoverHeader={t('createTopic.segementTimeLabelHead')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='segment jitter time'
                  fieldLabel='Segment jitter time'
                  fieldValue={'0'}
                  popoverBody={t('createTopic.jitterTimeLabelBody')}
                  popoverHeader={t('createTopic.jitterTimeLabelHead')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='file delete delay'
                  fieldLabel='File delete delay'
                  fieldValue={'60000'}
                  popoverBody={t('createTopic.deleteDelayLabelBody')}
                  popoverHeader={t('createTopic.deleteDelayLabelHead')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='preallocation log segment files'
                  fieldLabel='Preallocation log segment files'
                  fieldValue={'Disabled'}
                  popoverBody={t('createTopic.preallocateLabelBody')}
                  popoverHeader={t('createTopic.preallocateLabelHead')}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='index'>
                    Index
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('createTopic.indexSectionInfo')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel='index interval size'
                  fieldLabel='Index interval size'
                  fieldValue={'4096'}
                  popoverBody={t('createTopic.indexIntervalLabelBody')}
                  popoverHeader={t('createTopic.indexIntervalLabelHead')}
                  unit={'bytes'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='segment index size'
                  fieldLabel='Segment index size'
                  fieldValue={'10485760'}
                  popoverBody={t('createTopic.segementIntervalLabelBody')}
                  popoverHeader={t('createTopic.segementIntervalLabelHead')}
                  unit={'bytes'}
                />
              </StackItem>

              <StackItem>
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='flush'>
                    Flush
                  </Text>
                  <Text component={TextVariants.p} className='section-info'>
                    {t('createTopic.flushSectionInfo')}
                  </Text>
                </TextContent>

                <TextWithLabelPopover
                  btnAriaLabel='flush interval messages'
                  fieldLabel='Flush interval messages'
                  fieldValue={'9223372036854775807'}
                  popoverBody={t('createTopic.intervalMessagesLabelBody')}
                  popoverHeader={t('createTopic.intervalMessagesLabelHead')}
                  unit={'ms'}
                />

                <TextWithLabelPopover
                  btnAriaLabel='flush interval time'
                  fieldLabel='Flush interval time'
                  fieldValue={'9223372036854775807'}
                  popoverBody={t('createTopic.intervalTimeLabelBody')}
                  popoverHeader={t('createTopic.intervalTimeLabelHead')}
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
              Cancel
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
