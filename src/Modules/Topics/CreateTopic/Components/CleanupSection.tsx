import React from 'react';
import {
  Checkbox,
  Form,
  TextContent,
  TextVariants,
  NumberInput,
  Text,
  Stack,
} from '@patternfly/react-core';
import { FormGroupWithPopover } from '../../../../Components/FormGroupWithPopover/FormGroupWithPopover';
import { kebabToDotSeparated } from '../utils';
import { TopicContext } from '../../../../Contexts/Topic';
import { SizeTimeFormGroup } from '../../../../Components/SizeTimeFormGroup/SizeTimeFormGroup';
import { useTranslation } from 'react-i18next';

export const CleanupSection: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);

  const { t } = useTranslation();

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    updateStore(fieldName, Number(value));
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

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    updateStore(kebabToDotSeparated(fieldName), value);
  };

  const handleCheckboxSelect = (checked: boolean, event) => {
    const { name: fieldName } = event.currentTarget;
    updateStore(fieldName, checked);
  };

  return (
    <Stack hasGutter>
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
            inputName='delete.retention.ms'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['delete.retention.ms'])}
            plusBtnProps={{ name: 'delete-retention-ms' }}
            minusBtnProps={{ name: 'delete-retention-ms' }}
            id='delete-retention-unit'
            toggleId='delete-retention-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='delete-retention-ms-unit'
            dropdownValue={store['delete.retention.ms.unit']}
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
            inputName='min.cleanable.dirty.ratio'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['min.cleanable.dirty.ratio'])}
            plusBtnProps={{ name: 'min-cleanable-dirty-ratio' }}
            minusBtnProps={{ name: 'min-cleanable-dirty-ratio' }}
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
            inputName='min-compaction-lag-ms'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['min.compaction.lag.ms'])}
            plusBtnProps={{ name: 'min-compaction-lag-ms' }}
            minusBtnProps={{ name: 'min-compaction-lag-ms' }}
            id='min-lag-unit'
            toggleId='min-lag-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='min-compaction-lag-ms-unit'
            dropdownValue={store['min.compaction.lag.ms.unit']}
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
            inputName='segment-ms'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['segment.ms'])}
            plusBtnProps={{ name: 'segment-ms' }}
            minusBtnProps={{ name: 'segment-ms' }}
            id='segment-time-unit'
            toggleId='segment-time-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='segment-ms-unit'
            dropdownValue={store['segment.ms.unit']}
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
            inputName='segment-jitter-ms'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['segment.jitter.ms'])}
            plusBtnProps={{ name: 'segment.jitter.ms' }}
            minusBtnProps={{ name: 'segment.jitter.ms' }}
            id='jitter-time-unit'
            toggleId='jitter-time-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='segment-jitter-ms-unit'
            dropdownValue={store['segment.jitter.ms.unit']}
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
            inputName='file-delete-delay-ms'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['file.delete.delay.ms'])}
            plusBtnProps={{ name: 'file-delete-delay-ms' }}
            minusBtnProps={{ name: 'file-delete-delay-ms' }}
            id='delete-delay-unit'
            toggleId='delete-delay-unit-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='file-delete-delay-ms-unit'
            dropdownValue={store['file.delete.delay.ms.unit']}
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
            isChecked={Boolean(store.preallocate)}
            label='Allow preallocation of log segment files'
            aria-label='log segment files pre allocation'
            id='log-preallocation'
            onChange={handleCheckboxSelect}
            name='preallocate'
          />
        </FormGroupWithPopover>
      </Form>
    </Stack>
  );
};
