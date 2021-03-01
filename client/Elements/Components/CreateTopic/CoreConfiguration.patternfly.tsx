/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import {
  Form,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  NumberInput,
} from '@patternfly/react-core';
import React from 'react';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToCamel, kebabToDotSeparated } from './utils';
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
    updateStore(kebabToDotSeparated(fieldName), Number(value));
  };

  const handleTouchSpinInputChangeCamelCase = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    updateStore(kebabToCamel(fieldName), Number(value));
  };

  const handleTouchSpinPlus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    updateStore(fieldName, Number(store[fieldName]) + 1);
  };

  const handleTouchSpinPlusCamelCase = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    updateStore(fieldName, Number(store[fieldName]) + 1);
  };

  const handleTouchSpinMinus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    updateStore(fieldName, Number(store[fieldName]) - 1);
  };

  const handleTouchSpinMinusCamelCase = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    updateStore(fieldName, Number(store[fieldName]) - 1);
  };

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    updateStore(kebabToDotSeparated(fieldName), value);
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
          {t('createTopic.coreConfigInfo')}
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
            name='name'
            value={store.name}
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
          <NumberInput
            id='create-topic-partitions'
            inputName='num-partitions'
            onChange={handleTouchSpinInputChangeCamelCase}
            onPlus={handleTouchSpinPlusCamelCase}
            onMinus={handleTouchSpinMinusCamelCase}
            value={Number(store.numPartitions)}
            plusBtnProps={{ name: 'num-partitions' }}
            minusBtnProps={{ name: 'num-partitions' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='replicas'
          fieldLabel='Replicas'
          labelHead={t('createTopic.replicasLabelHead')}
          labelBody={t('createTopic.replicasLabelBody')}
          buttonAriaLabel='More info for replicas field'
        >
          <NumberInput
            inputName='replicas'
            onChange={handleTouchSpinInputChangeCamelCase}
            onPlus={handleTouchSpinPlusCamelCase}
            onMinus={handleTouchSpinMinusCamelCase}
            value={Number(store.replicationFactor)}
            plusBtnProps={{ name: 'replication-factor' }}
            minusBtnProps={{ name: 'replication-factor' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='insyncreplicas'
          fieldLabel='Minimum in-sync replicas'
          labelHead={t('createTopic.inSyncReplicasLabelHead')}
          labelBody={t('createTopic.inSyncReplicasLabelBody')}
          buttonAriaLabel='More info for minimum in-sync replicas field'
        >
          <NumberInput
            id='insyncreplicas'
            inputName='min-insync-replicas'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['min.insync.replicas'])}
            plusBtnProps={{ name: 'min-insync-replicas' }}
            minusBtnProps={{ name: 'min-insync-replicas' }}
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
            inputName='retention-ms'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={Number(store['retention.ms'])}
            plusBtnProps={{ name: 'retention-ms' }}
            minusBtnProps={{ name: 'retention-ms' }}
            id='core-config-retention-time-unit'
            toggleId='core-config-retention-dropdowntoggle'
            name='retention-ms-unit'
            dropdownValue={store['retention.ms.unit']}
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