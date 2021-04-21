import React from 'react';
import {
  TextContent,
  Text,
  TextVariants,
  NumberInput,
  FormGroup,
  Form,
  Stack,
} from '@patternfly/react-core';
import './CreateTopicWizard.css';
export interface IStepPartitions {
  setPartitionTouchspinValue: (value: number) => void;
  partitionTouchspinValue: number;
}

export const StepPartitions: React.FC<IStepPartitions> = ({
  partitionTouchspinValue,
  setPartitionTouchspinValue,
}) => {
  const handleOnPlus = () => {
    setPartitionTouchspinValue(partitionTouchspinValue + 1);
  };
  const handleOnMinus = () => {
    setPartitionTouchspinValue(partitionTouchspinValue - 1);
  };
  const handlePartitionTouchspinChange = (event) => {
    setPartitionTouchspinValue(Number(event.target.value));
  };

  return (
    <Stack hasGutter className='kafka-ui--wizard-main-body__stack'>
      <TextContent>
        <Text component={TextVariants.h2}>Partitions</Text>
        <Text component={TextVariants.p}>An ordered list of messages</Text>
        <Text component={TextVariants.small}>
          One or more partitions make up a topic. Partitions are distributed
          across the brokers to increase the scalability of your topic. You can
          also use them to distribute messages across the members of the
          consumer group.
        </Text>
      </TextContent>
      <Form>
        <FormGroup
          label='Partitions'
          fieldId='step-topic-name-form'
          helperText='One partition is sufficient for getting started, but production systems often have more.'
          isRequired
        >
          <NumberInput
            onPlus={handleOnPlus}
            onMinus={handleOnMinus}
            value={partitionTouchspinValue}
            inputName='input'
            onChange={handlePartitionTouchspinChange}
            widthChars={20}
            min={0}
          />
        </FormGroup>
      </Form>
    </Stack>
  );
};
