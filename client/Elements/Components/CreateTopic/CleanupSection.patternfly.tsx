/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Checkbox,
  Form,
  TextContent,
  TextVariants,
  NumberInput,
  Text,
} from '@patternfly/react-core';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToCamel } from './utils';
import { TopicContext } from 'Contexts/Topic';
import { SizeTimeFormGroup } from '../Common/SizeTimeFormGroup/SizeTimeFormGroup.patternfly';
import { useTranslation } from 'react-i18next';

export const CleanupSection: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);

  const { t } = useTranslation();

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    updateStore(fieldName, Number(value));
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

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    updateStore(kebabToCamel(fieldName), value);
  };

  const handleCheckboxSelect = (checked: boolean, event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    updateStore(fieldName, checked);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='cleanup'>
          Cleanup
        </Text>
        <Text component={TextVariants.p}>
          {t('createTopic.cleanupSectionInfo')}
        </Text>
      </TextContent>

      <Form>
        <FormGroupWithPopover
          fieldId='delete-retention'
          fieldLabel='Delete retention'
          labelHead={t('createTopic.deleteRetentionLabelHead')}
          labelBody={t('createTopic.deleteRetentionLabelBody')}
          buttonAriaLabel='More info for delete retention field'
        >
          <SizeTimeFormGroup
            inputName='delete-retention-time'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.deleteRetentionTime}
            plusBtnProps={{ name: 'delete-retention-time' }}
            minusBtnProps={{ name: 'delete-retention-time' }}
            id='delete-retention-unit'
            toggleId='delete-retention-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='delete-retention-unit'
            dropdownValue={store.deleteRetentionUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='dirty-ratio'
          fieldLabel='Minimum cleanable dirty ratio'
          labelHead={t('createTopic.minRatioLabelHead')}
          labelBody={t('createTopic.minRatioLabelBody')}
          buttonAriaLabel='More info for minimum cleanable ratio field'
        >
          <NumberInput
            inputName='min-ratio'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.minRatio}
            plusBtnProps={{ name: 'min-ratio' }}
            minusBtnProps={{ name: 'min-ratio' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='compaction'
          fieldLabel='Minimum compaction lag time'
          labelHead={t('createTopic.minLagLabelHead')}
          labelBody={t('createTopic.minLagLabelBody')}
          buttonAriaLabel='More info for minimum compaction log time field'
        >
          <SizeTimeFormGroup
            inputName='min-lag-time'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.minLagTime}
            plusBtnProps={{ name: 'min-lag-time' }}
            minusBtnProps={{ name: 'min-lag-time' }}
            id='min-lag-unit'
            toggleId='min-lag-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='min-lag-unit'
            dropdownValue={store.minLagUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='segment-time'
          fieldLabel='Segment time'
          labelHead={t('createTopic.segementTimeLabelHead')}
          labelBody={t('createTopic.segementTimeLabelBody')}
          buttonAriaLabel='More info for segment time field'
        >
          <SizeTimeFormGroup
            inputName='segment-time'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.segmentTime}
            plusBtnProps={{ name: 'segment-time' }}
            minusBtnProps={{ name: 'segment-time' }}
            id='segment-time-unit'
            toggleId='segment-time-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='segment-time-unit'
            dropdownValue={store.segmentTimeUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='jitter'
          fieldLabel='Segment jitter time'
          labelHead={t('createTopic.jitterTimeLabelHead')}
          labelBody={t('createTopic.jitterTimeLabelBody')}
          buttonAriaLabel='More info for segment jitter time field'
        >
          <SizeTimeFormGroup
            inputName='jitter-time'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.jitterTime}
            plusBtnProps={{ name: 'jitter-time' }}
            minusBtnProps={{ name: 'jitter-time' }}
            id='jitter-time-unit'
            toggleId='jitter-time-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='jitter-time-unit'
            dropdownValue={store.jitterTimeUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='delete'
          fieldLabel='File delete delay'
          labelHead={t('createTopic.deleteDelayLabelHead')}
          labelBody={t('createTopic.deleteDelayLabelBody')}
          buttonAriaLabel='More info for file delete delay field'
        >
          <SizeTimeFormGroup
            inputName='delete-delay'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.deleteDelay}
            plusBtnProps={{ name: 'delete-delay' }}
            minusBtnProps={{ name: 'delete-delay' }}
            id='delete-delay-unit'
            toggleId='delete-delay-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='delete-delay-unit'
            dropdownValue={store.deleteDelayUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='log-preallocation'
          fieldLabel='Preallocate log segment files'
          labelHead={t('createTopic.preallocateLabelHead')}
          labelBody={t('createTopic.preallocateLabelBody')}
          buttonAriaLabel='More info for preallocation field'
        >
          <Checkbox
            isChecked={store.logPreallocation}
            label='Allow preallocation of log segment files'
            aria-label='log segment files pre allocation'
            id='log-preallocation'
            onChange={handleCheckboxSelect}
            name='log-preallocation'
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};
