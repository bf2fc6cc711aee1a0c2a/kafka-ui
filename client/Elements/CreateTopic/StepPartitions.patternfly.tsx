/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  TextContent,
  Text,
  TextVariants,
  Touchspin,
} from '@patternfly/react-core';

interface IStepPartitions {
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
    <>
      <TextContent className='topics-wizard-content'>
        <Text component={TextVariants.h2}>Partitions</Text>
        <Text component={TextVariants.p}>
          One or more partitions make up a topic. A partition is an ordered list
          of messages.
        </Text>
        <Text component={TextVariants.small}>
          Partitions are distributed across the brokers in order to increase the
          scalability of your topic. You can also use them to distribute
          messages across the members of a consumer group.
        </Text>
        <Touchspin
          onPlus={handleOnPlus}
          onMinus={handleOnMinus}
          value={partitionTouchspinValue}
          inputName='input'
          onChange={handlePartitionTouchspinChange}
        />
      </TextContent>
    </>
  );
};
