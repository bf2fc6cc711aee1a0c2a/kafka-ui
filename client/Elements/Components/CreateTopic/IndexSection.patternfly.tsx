/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { TextContent, Text, Form, TextVariants } from '@patternfly/react-core';
import React from 'react';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToDotSeparated } from './utils';
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

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    updateStore(kebabToDotSeparated(fieldName), value);
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
            inputName='index-interval-bytes'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['index.interval.bytes'])}
            plusBtnProps={{ name: 'index-interval-bytes' }}
            minusBtnProps={{ name: 'index-interval-bytes' }}
            toggleId='index-interval-unit-dropdowntoggle'
            name='index-interval-bytes-unit'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            dropdownValue={store['index.interval.bytes.unit']}
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
            inputName='segment-index-bytes'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['segment.index.bytes'])}
            plusBtnProps={{ name: 'segment-index-bytes' }}
            minusBtnProps={{ name: 'segment-index-bytes' }}
            toggleId='segment-index-unit-dropdowntoggle'
            name='segment-index-bytes-unit'
            ariaLabel='select duration from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            dropdownValue={store['segment.index.bytes.unit']}
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};