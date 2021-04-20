import React, { useState } from 'react';
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
  const [validated, setValidated] = useState<'warning' | 'default'>('default');
  const [warning, setWarning] = useState<boolean>(false);
  const [topicValidated, setTopicValidated] = useState<'error' | 'default'>(
    'default'
  );
  const [invalidText, setInvalidText] = useState('This is a required field');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { t } = useTranslation();

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

  const handleTextInputChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const regexp1 = new RegExp('^[0-9A-Za-z_-]+$');

    if (value.length && !regexp1.test(value)) {
      setInvalidText(
        'Invalid input. Only letters(Aa-Zz),numbers "_" and "-" are accepted'
      );
      setTopicValidated('error');
    } else if (value.length < 1) {
      setInvalidText('This is a required field');
      setTopicValidated('error');
    } else if (value.length > 249) {
      setTopicValidated('error');
      setInvalidText('Topic name cannot exceed 249 characters');
    } else setValidated('default');
    const { name: fieldName } = event.currentTarget;
    setTopicData({ ...topicData, [kebabToCamel(fieldName)]: value });
  };

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    setTopicData({ ...topicData, [kebabToDotSeparated(fieldName)]: value });
  };

  const onPartitionsChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = event.currentTarget;
    setTopicData({ ...topicData, [kebabToCamel(fieldName)]: Number(value) });
  };

  const handleTouchSpinPlusCamelCase = (event) => {
    setValidated('warning');
    setWarning(true);

    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    setTopicData({
      ...topicData,
      [fieldName]: Number(topicData[fieldName]) + 1,
    });
  };

  const handleTouchSpinMinusCamelCase = (event) => {
    setValidated('warning');
    setWarning(true);
    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    setTopicData({
      ...topicData,
      [fieldName]: Number(topicData[fieldName]) - 1,
    });
  };

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    setTopicData({
      ...topicData,
      [kebabToDotSeparated(fieldName)]: Number(value),
    });
  };

  const handleTouchSpinPlus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    setTopicData({
      ...topicData,
      [fieldName]: Number(topicData[fieldName]) + 1,
    });
  };

  const handleTouchSpinMinus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    setTopicData({
      ...topicData,
      [fieldName]: Number(topicData[fieldName]) - 1,
    });
  };

  const onDropdownChangeDotSeparated = (value: string, event) => {
    const { name: fieldName } = event.target;
    setTopicData({ ...topicData, [kebabToDotSeparated(fieldName)]: value });
  };
  const onConfirm = () => {
    if (warning) setIsOpen(true);
    else saveTopic();
  };
  const onSaveClick = () => {
    setIsOpen(false);
    saveTopic();
  };

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
                  <FormGroupWithPopover
                    fieldId='create-topic-partitions'
                    fieldLabel='Partitions'
                    labelHead={t('createTopic.partitionsLabelHead')}
                    labelBody={t('createTopic.partitionsLabelBody')}
                    buttonAriaLabel='More info for partitions field'
                    validated={validated}
                    helperText={
                      warning
                        ? `Increasing a topic's partitions might result in messages having the same key from two different partitions,which can potentially break the message ordering guarantees that apply to a single partition`
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
                    />
                  </FormGroupWithPopover>
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
                    <SizeTimeFormGroup
                      inputName='retention-ms'
                      onChange={handleTouchSpinInputChange}
                      onPlus={handleTouchSpinPlus}
                      onMinus={handleTouchSpinMinus}
                      value={Number(topicData['retention.ms'])}
                      plusBtnProps={{ name: 'retention-ms' }}
                      minusBtnProps={{ name: 'retention-ms' }}
                      id='core-config-retention-time-unit'
                      toggleId='core-config-retention-dropdowntoggle'
                      name='retention-ms-unit'
                      dropdownValue={topicData['retention.ms.unit']}
                      ariaLabel='select unit from dropdown'
                      onSelectOption={onDropdownChange}
                      type='time'
                    />
                  </FormGroupWithPopover>
                  <FormGroupWithPopover
                    fieldId='retention-size'
                    fieldLabel='Retention size'
                    labelHead={t('createTopic.retentionBytesLabelHead')}
                    labelBody={t('createTopic.retentionBytesLabelBody')}
                    buttonAriaLabel='More info for retention size field'
                  >
                    <SizeTimeFormGroup
                      inputName='retention-bytes'
                      onChange={handleTouchSpinInputChange}
                      onPlus={handleTouchSpinPlus}
                      onMinus={handleTouchSpinMinus}
                      value={Number(topicData['retention.bytes'])}
                      plusBtnProps={{ name: 'retention-bytes' }}
                      minusBtnProps={{ name: 'retention-bytes' }}
                      id='core-config-retention-size-unit'
                      toggleId='core-config-retention-size-dropdowntoggle'
                      name='retention-bytes-unit'
                      dropdownValue={topicData['retention.bytes.unit']}
                      ariaLabel='select unit from dropdown'
                      onSelectOption={onDropdownChange}
                      type='memory'
                    />
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
          {isOpen && (
            <PartitionsChangeModal
              isOpen={isOpen}
              onSaveClick={onSaveClick}
              setIsOpen={setIsOpen}
            />
          )}
        </SidebarContent>
      </Sidebar>
    </>
  );
};
