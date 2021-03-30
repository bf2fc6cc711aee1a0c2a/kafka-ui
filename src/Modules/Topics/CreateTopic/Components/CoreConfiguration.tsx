import {
  Form,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  NumberInput,
  Stack,
} from '@patternfly/react-core';
import React from 'react';
import { FormGroupWithPopover } from '../../../../Components/FormGroupWithPopover/FormGroupWithPopover';
import { kebabToCamel, kebabToDotSeparated } from '../utils';
import { TopicContext } from '../../../../Contexts/Topic';
import { SizeTimeFormGroup } from '../../../../Components/SizeTimeFormGroup/SizeTimeFormGroup';
import { useTranslation } from 'react-i18next';
import { TextWithLabelPopover } from '../../../../Components/TextWithLabelPopover/TextWithLabelPopover';

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
    <Stack hasGutter>
      <TextContent>
        <Title
          headingLevel='h2'
          size='xl'
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
            placeholder='Enter topic name'
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
        <TextWithLabelPopover
          btnAriaLabel='topic detail replicas'
          fieldLabel='Replicas'
          fieldValue={store.replicationFactor}
          popoverBody={t('createTopic.replicasLabelBody')}
          popoverHeader={t('createTopic.replicasLabelHead')}
        />

        <TextWithLabelPopover
          btnAriaLabel='topic detail min-in-sync replica'
          fieldLabel='Minimum in-sync replicas'
          fieldValue={store['min.insync.replicas']}
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
    </Stack>
  );
};

export { CoreConfiguration };
