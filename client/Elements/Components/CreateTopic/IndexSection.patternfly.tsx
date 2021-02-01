/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { TextContent, Text, Form, TextVariants } from '@patternfly/react-core';
import React from 'react';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToCamel } from './utils';
import { SizeTimeFormGroup } from '../Common/SizeTimeFormGroup/SizeTimeFormGroup.patternfly';
import { TopicContext } from 'Contexts/Topic';
import { useTranslation } from 'react-i18next';

export const IndexSection: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);

  const { t } = useTranslation();

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    updateStore(kebabToCamel(fieldName), value);
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

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='index'>
          Index
        </Text>
        <Text component={TextVariants.p}>
          {t('createTopic.indexSectionInfo')}
        </Text>
      </TextContent>

      <Form>
        <FormGroupWithPopover
          fieldId='interval-bytes'
          fieldLabel='Index interval bytes'
          labelHead={t('createTopic.indexIntervalLabelHead')}
          labelBody={t('createTopic.indexIntervalLabelBody')}
          buttonAriaLabel='More info for index interval bytes field'
        >
          <SizeTimeFormGroup
            id='index-interval-size'
            inputName='index-interval-size'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.indexIntervalSize}
            plusBtnProps={{ name: 'index-interval-size' }}
            minusBtnProps={{ name: 'index-interval-size' }}
            toggleId='index-interval-unit-dropdowntoggle'
            name='index-interval-unit'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            dropdownValue={store.indexIntervalUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='int-bytes'
          fieldLabel='Segment interval bytes'
          labelHead={t('createTopic.segementIntervalLabelHead')}
          labelBody={t('createTopic.segementIntervalLabelBody')}
          buttonAriaLabel='More info for segment interval bytes field'
        >
          <SizeTimeFormGroup
            id='segment-index-size'
            inputName='segment-index-size'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.segmentIndexSize}
            plusBtnProps={{ name: 'segment-index-size' }}
            minusBtnProps={{ name: 'segment-index-size' }}
            toggleId='segment-index-unit-dropdowntoggle'
            name='segment-index-unit'
            ariaLabel='select duration from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            dropdownValue={store.segmentIndexUnit}
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};
