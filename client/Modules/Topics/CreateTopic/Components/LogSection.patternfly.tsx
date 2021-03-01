import { TextVariants, Text, TextContent, Form } from '@patternfly/react-core';
import React from 'react';
import {
  DropdownWithToggle,
  IDropdownOption,
} from 'Components/DropdownWithToggle.patternfly';
import { FormGroupWithPopover } from 'Components/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToDotSeparated } from '../utils';
import { SizeTimeFormGroup } from 'Components/SizeTimeFormGroup/SizeTimeFormGroup.patternfly';
import { TopicContext } from 'Contexts/Topic';
import { useTranslation } from 'react-i18next';

const clearOptions: IDropdownOption[] = [
  { key: 'compact', value: 'compact', isDisabled: false },
  { key: 'delete', value: 'delete', isDisabled: false },
  { key: 'compact-delete', value: 'compact, delete', isDisabled: false },
  { key: 'delete-compact', value: 'delete, compact', isDisabled: false },
];

const LogSection: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);

  const { t } = useTranslation();

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    updateStore(kebabToDotSeparated(fieldName), value);
  };

  const onDropdownChangeDotSeparated = (value: string, event) => {
    const { name: fieldName } = event.target;
    updateStore(kebabToDotSeparated(fieldName), value);
  };

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    updateStore(kebabToDotSeparated(fieldName), Number(value));
  };

  const handleTouchSpinPlus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    updateStore(fieldName, Number(store[fieldName]) + 1);
  };

  const handleTouchSpinMinus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    updateStore(fieldName, Number(store[fieldName]) - 1);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='log'>
          Log
        </Text>
        <Text component={TextVariants.p}>
          {t('createTopic.logSectionInfo')}
        </Text>
      </TextContent>

      <Form>
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
            name='log-cleanup-policy'
            value={store['log.cleanup.policy'] || ''}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='retention-bytes'
          fieldLabel='Retention bytes'
          labelHead={t('createTopic.retentionBytesLabelHead')}
          labelBody={t('createTopic.retentionBytesLabelBody')}
          buttonAriaLabel='More info for retention bytes field'
        >
          <SizeTimeFormGroup
            inputName='log-retention-bytes'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['log.retention.bytes'])}
            plusBtnProps={{ name: 'log-retention-bytes' }}
            minusBtnProps={{ name: 'log-retention-bytes' }}
            id='log-section-retention-unit-dropdown'
            toggleId='log-section-retention-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            name='log-retention-bytes-unit'
            dropdownValue={store['log.retention.bytes.unit']}
          />
        </FormGroupWithPopover>

        <FormGroupWithPopover
          fieldId='log-type'
          fieldLabel='Log segment types'
          labelHead={t('createTopic.logSegmentLabelHead')}
          labelBody={t('createTopic.logSegmentLabelBody')}
          buttonAriaLabel='More info for log segment types field'
        >
          <SizeTimeFormGroup
            inputName='log-segment-bytes'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['log.segment.bytes'])}
            plusBtnProps={{ name: 'log-segment-bytes' }}
            minusBtnProps={{ name: 'log-segment-bytes' }}
            id='log-section-segment-unit-dropdown'
            toggleId='log-section-segment-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            name='log-segment-bytes-unit'
            dropdownValue={store['log.segment.bytes.unit']}
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};

export { LogSection };
