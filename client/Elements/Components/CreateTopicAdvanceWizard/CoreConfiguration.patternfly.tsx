/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import '@patternfly/react-core/dist/styles/base.css';
import {
  Flex,
  FlexItem,
  Form,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  Touchspin,
} from '@patternfly/react-core';
import React from 'react';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../Common/DropdownWithToggle.patternfly';
import { ICoreConfigData } from './CreateTopicAdvanceWizard.patternfly';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';

interface ICoreConfigurationProps {
  coreConfigData: ICoreConfigData;
  setCoreConfigData: React.Dispatch<React.SetStateAction<ICoreConfigData>>;
}

const timeUnits: IDropdownOption[] = [
  { key: 'millisecond', value: 'millisecond', isDisabled: false },
  { key: 'second', value: 'second', isDisabled: false },
  { key: 'day', value: 'day', isDisabled: false },
  { key: 'month', value: 'month', isDisabled: false },
  { key: 'year', value: 'year', isDisabled: false },
];

const topicNameLabelHead = 'Topic name';
const topicNameLabelBody =
  "This is the unique identifier for this topic within this cluster. You'll need this to set up your producers and consumers, so make it something memorable.";

const partitionsLabelHead = 'Partitions';
const partitionsLabelBody =
  'A partition is an ordered list of messages. One or more partitions make up a topic.';

const replicasLabelHead = 'Replicas';
const replicasLabelBody =
  'In order to improve availability, each topic can be replicated onto multiple brokers. If a following replica is keeping up with the partition leader, its replica is in-sync. Any follower with an in-sync replica can become the leader without losing any messages.';

const inSyncReplicasLabelHead = 'Minimum in-sync replicas';
const inSyncReplicasLabelBody =
  'Determines the reliability guarantee achievable for this topic. The minimum number of replicas that must acknowledge a write to satisfy a producer that requests acknowledgements from all replicas. (min.insync.replicas)';

const retentionTimeLabelHead = 'Retention time';
const retentionTimeLabelBody =
  'The length of time that messages are retained before they are deleted. If your messages are not read by a consumer within this time, they will be missed. (retention.ms)';

const CoreConfiguration: React.FC<ICoreConfigurationProps> = ({
  coreConfigData,
  setCoreConfigData,
}) => {
  const handleTextInputChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName } = event.currentTarget;
    setCoreConfigData((formData) => ({
      ...formData,
      [fieldName]: value,
    }));
  };

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    setCoreConfigData((formData) => ({
      ...formData,
      [fieldName]: Number(value),
    }));
  };

  const handleTouchSpinPlus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setCoreConfigData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] + 1,
    }));
  };

  const handleTouchSpinMinus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setCoreConfigData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] - 1,
    }));
  };

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    setCoreConfigData((formData) => ({ ...formData, [fieldName]: value }));
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
          labelHead={topicNameLabelHead}
          fieldId='create-topic-name'
          fieldLabel='Topic name'
          labelBody={topicNameLabelBody}
          buttonAriaLabel='More info for topic name field'
        >
          <TextInput
            isRequired
            type='text'
            id='create-topic-name'
            name='topic-name'
            value={coreConfigData['topic-name']}
            onChange={handleTextInputChange}
            label='Topic name'
            placeholder='Test topic name'
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='create-topic-partitions'
          fieldLabel='Partitions'
          labelHead={partitionsLabelHead}
          labelBody={partitionsLabelBody}
          buttonAriaLabel='More info for partitions field'
        >
          <Touchspin
            id='create-topic-partitions'
            inputName='partitions'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={coreConfigData.partitions}
            plusBtnProps={{ name: 'partitions' }}
            minusBtnProps={{ name: 'partitions' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='replicas'
          fieldLabel='Replicas'
          labelHead={replicasLabelHead}
          labelBody={replicasLabelBody}
          buttonAriaLabel='More info for replicas field'
        >
          <Touchspin
            inputName='replicas'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={coreConfigData.replicas}
            plusBtnProps={{ name: 'replicas' }}
            minusBtnProps={{ name: 'replicas' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='insyncreplicas'
          fieldLabel='Minimum in-sync replicas'
          labelHead={inSyncReplicasLabelHead}
          labelBody={inSyncReplicasLabelBody}
          buttonAriaLabel='More info for minimum in-sync replicas field'
        >
          <Touchspin
            id='insyncreplicas'
            inputName='min-in-sync'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={coreConfigData['min-in-sync']}
            plusBtnProps={{ name: 'min-in-sync' }}
            minusBtnProps={{ name: 'min-in-sync' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='retention'
          fieldLabel='Retention time'
          labelHead={retentionTimeLabelHead}
          labelBody={retentionTimeLabelBody}
          buttonAriaLabel='More info for retention time field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                id='retention'
                inputName='retention-time'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={coreConfigData['retention-time']}
                plusBtnProps={{ name: 'retention-time' }}
                minusBtnProps={{ name: 'retention-time' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='core-config-retention-time-duration'
                toggleId='core-config-retention-dropdowntoggle'
                name='retention-time-duration'
                value={coreConfigData['retention-time-duration']}
                ariaLabel='select duration from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
      </Form>
    </>
  );
};

export { CoreConfiguration };
