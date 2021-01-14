/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import '@patternfly/react-core/dist/styles/base.css';
import {
  Form,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  Touchspin,
} from '@patternfly/react-core';
import React from 'react';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToCamel } from './utils';
import { TopicContext } from 'Contexts/Topic';
import { SizeTimeFormGroup } from '../Common/SizeTimeFormGroup/SizeTimeFormGroup.patternfly';
import { useTranslation } from 'react-i18next';

const CoreConfiguration: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);

  const { t } = useTranslation();

  const handleTextInputChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName } = event.currentTarget;
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

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    updateStore(kebabToCamel(fieldName), value);
  };

  return (
    <>
      <TextContent>
        <Title
          headingLevel='h2'
          size='2xl'
          id='core-configuration'
          tabIndex={-1}
        >
          Core configuration
        </Title>
        <Text component={TextVariants.p}>
          We recommend you fill out and evaluate these details at a minimum
          before deploying your topic.
        </Text>
      </TextContent>
      <Form>
        <FormGroupWithPopover
          labelHead={t('createTopic.topicNameLabelHead')}
          fieldId='create-topic-name'
          fieldLabel='Topic name'
          labelBody={t('createTopic.topicNameLabelBody')}
          buttonAriaLabel='More info for topic name field'
        >
          <TextInput
            isRequired
            type='text'
            id='create-topic-name'
            name='topic-name'
            value={store.topicName}
            onChange={handleTextInputChange}
            label='Topic name'
            placeholder='Test topic name'
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='create-topic-partitions'
          fieldLabel='Partitions'
          labelHead={t('createTopic.partitionsLabelHead')}
          labelBody={t('createTopic.partitionsLabelBody')}
          buttonAriaLabel='More info for partitions field'
        >
          <Touchspin
            id='create-topic-partitions'
            inputName='partitions'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.partitions}
            plusBtnProps={{ name: 'partitions' }}
            minusBtnProps={{ name: 'partitions' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='replicas'
          fieldLabel='Replicas'
          labelHead={t('createTopic.replicasLabelHead')}
          labelBody={t('createTopic.replicasLabelBody')}
          buttonAriaLabel='More info for replicas field'
        >
          <Touchspin
            inputName='replicas'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.replicas}
            plusBtnProps={{ name: 'replicas' }}
            minusBtnProps={{ name: 'replicas' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='insyncreplicas'
          fieldLabel='Minimum in-sync replicas'
          labelHead={t('createTopic.inSyncReplicasLabelHead')}
          labelBody={t('createTopic.inSyncReplicasLabelBody')}
          buttonAriaLabel='More info for minimum in-sync replicas field'
        >
          <Touchspin
            id='insyncreplicas'
            inputName='min-in-sync-replicas'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.minInSyncReplicas}
            plusBtnProps={{ name: 'min-in-sync-replicas' }}
            minusBtnProps={{ name: 'min-in-sync-replicas' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='retention'
          fieldLabel='Retention time'
          labelHead={t('createTopic.retentionTimeLabelHead')}
          labelBody={t('createTopic.retentionTimeLabelBody')}
          buttonAriaLabel='More info for retention time field'
        >
          <SizeTimeFormGroup
            inputName='retention-time'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.retentionTime}
            plusBtnProps={{ name: 'retention-time' }}
            minusBtnProps={{ name: 'retention-time' }}
            id='core-config-retention-time-unit'
            toggleId='core-config-retention-dropdowntoggle'
            name='retention-time-unit'
            dropdownValue={store.retentionTimeUnit}
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};

export { CoreConfiguration };
