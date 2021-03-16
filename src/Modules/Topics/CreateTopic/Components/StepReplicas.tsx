import React from 'react';
import {
  Alert,
  Form,
  FormGroup,
  NumberInput,
  Radio,
  Stack,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import './CreateTopicWizard.css';

export interface IStepReplicas {
  setReplicationFactorTouchspinValue: (value: number) => void;
  setMinInSyncReplicaTouchspinValue: (value: number) => void;
  replicationFactorTouchspinValue: number;
  minInSyncReplicaTouchspinValue: number;
}

export const StepReplicas: React.FC<IStepReplicas> = ({
  setReplicationFactorTouchspinValue,
  setMinInSyncReplicaTouchspinValue,
  replicationFactorTouchspinValue,
  minInSyncReplicaTouchspinValue,
}) => {
  enum ReplicationOption {
    ONE = 1,
    TWO = 2,
    CUSTOM = 'custom',
  }

  const [
    currentReplicationFactor,
    setCurrentReplicationFactor,
  ] = React.useState<string | number>(ReplicationOption.ONE);
  const handleChangeReplicationFactor = (checked, event) => {
    const target = event.target;
    const name = target.name;

    if (name === 'radio4') {
      setCurrentReplicationFactor(ReplicationOption.ONE);
      setMinInSyncReplicaTouchspinValue(ReplicationOption.ONE);
      setReplicationFactorTouchspinValue(ReplicationOption.ONE);
    } else if (name === 'radio5') {
      setCurrentReplicationFactor(ReplicationOption.TWO);
      setMinInSyncReplicaTouchspinValue(ReplicationOption.TWO);
      setReplicationFactorTouchspinValue(ReplicationOption.TWO);
    } else if (name === 'radio6') {
      setCurrentReplicationFactor(ReplicationOption.CUSTOM);
      setMinInSyncReplicaTouchspinValue(minInSyncReplicaTouchspinValue);
      setReplicationFactorTouchspinValue(replicationFactorTouchspinValue);
    }
  };

  const preventFormSubmit = (event) => event.preventDefault();

  const handleOnPlusReplicationFactor = () => {
    setReplicationFactorTouchspinValue(replicationFactorTouchspinValue + 1);
  };
  const handleOnMinusReplicationFactor = () => {
    setReplicationFactorTouchspinValue(replicationFactorTouchspinValue - 1);
  };
  const handleReplicationFactorChange = (event) => {
    setReplicationFactorTouchspinValue(Number(event.target.value));
  };

  const handleOnPlusMinInSyncReplicaFactor = () => {
    setMinInSyncReplicaTouchspinValue(minInSyncReplicaTouchspinValue + 1);
  };
  const handleOnMinusMinInSyncReplicaFactor = () => {
    setMinInSyncReplicaTouchspinValue(minInSyncReplicaTouchspinValue - 1);
  };
  const handleMinInSyncReplicaChange = (event) => {
    setMinInSyncReplicaTouchspinValue(Number(event.target.value));
  };

  return (
    <Stack hasGutter className='kafka-ui--wizard-main-body__stack'>
      <TextContent>
        <Text component={TextVariants.h2}>Replicas</Text>
        <Text component={TextVariants.p}>
          How many copies of a topic will be made for high availability.
        </Text>
        <Text component={TextVariants.small}>
          The partitions of each topic can be replicated across a configurable
          number of brokers.
        </Text>
      </TextContent>
      <Alert
        variant='info'
        isInline
        title='Streams for Apache Kafka only supports 3 replicas and a minimum in-sync replica factor of 2.'
      />
      <Form onSubmit={preventFormSubmit}>
        <FormGroup
          fieldId='create-wizard-replica-form-group'
          label='Replicas'
          className='form-group-radio'
        >
          <Stack hasGutter>
            <Radio
              isChecked={currentReplicationFactor === ReplicationOption.ONE}
              name='radio4'
              onChange={handleChangeReplicationFactor}
              label='Replication factor: 1'
              id='radio-controlled-4'
              value='radio4'
              description='Minimum in-sync replicas: 1'
            />
            <Radio
              isChecked={currentReplicationFactor === ReplicationOption.TWO}
              name='radio5'
              onChange={handleChangeReplicationFactor}
              label='Replication factor: 2'
              id='radio-controlled-5'
              value='radio5'
              description='Minimum in-sync replicas: 2'
            />
            <Radio
              isChecked={currentReplicationFactor === ReplicationOption.CUSTOM}
              name='radio6'
              onChange={handleChangeReplicationFactor}
              label='Replication factor'
              id='radio-controlled-6'
              value='radio6'
            />
            <div className='kafka-ui--radio__parameters'>
              <NumberInput
                value={replicationFactorTouchspinValue}
                onMinus={handleOnMinusReplicationFactor}
                onPlus={handleOnPlusReplicationFactor}
                onChange={handleReplicationFactorChange}
              />
              <Text
                component={TextVariants.small}
                className='minimum-in-sync-replicas'
              >
                Minimum in-sync replicas
              </Text>
              <NumberInput
                value={minInSyncReplicaTouchspinValue}
                onMinus={handleOnMinusMinInSyncReplicaFactor}
                onPlus={handleOnPlusMinInSyncReplicaFactor}
                onChange={handleMinInSyncReplicaChange}
              />
            </div>
          </Stack>
        </FormGroup>
      </Form>
    </Stack>
  );
};
