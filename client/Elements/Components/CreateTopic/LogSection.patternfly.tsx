/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { TextVariants, Text, TextContent, Form } from '@patternfly/react-core';
import React from 'react';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../Common/DropdownWithToggle.patternfly';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToCamel } from './utils';
import { SizeTimeFormGroup } from '../Common/SizeTimeFormGroup/SizeTimeFormGroup.patternfly';
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
    updateStore(kebabToCamel(fieldName), value);
  };

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    updateStore(kebabToCamel(fieldName), Number(value));
  };

  const handleTouchSpinPlus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    updateStore(fieldName, store[fieldName] + 1);
  };

  const handleTouchSpinMinus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    updateStore(fieldName, store[fieldName] - 1);
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
            onSelectOption={onDropdownChange}
            items={clearOptions}
            name='cleanup-policy'
            value={store.cleanupPolicy}
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
            inputName='retention-bytes'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.retentionBytes}
            plusBtnProps={{ name: 'retention-bytes' }}
            minusBtnProps={{ name: 'retention-bytes' }}
            id='log-section-retention-unit-dropdown'
            toggleId='log-section-retention-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            name='retention-unit'
            dropdownValue={store.retentionUnit}
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
            inputName='segment-size'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.segmentSize}
            plusBtnProps={{ name: 'segment-size' }}
            minusBtnProps={{ name: 'segment-size' }}
            id='log-section-segment-unit-dropdown'
            toggleId='log-section-segment-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            name='segment-unit'
            dropdownValue={store.segmentUnit}
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};

export { LogSection };
