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
import "@app/modules/Topics/components/CreateTopicWizard/CreateTopicWizard.css";
import { useTranslation } from 'react-i18next';

export interface IStepPartitions {
  setPartitionTouchspinValue: (value: number) => void;
  partitionTouchspinValue: number;
}

export const StepPartitions: React.FC<IStepPartitions> = ({
  partitionTouchspinValue,
  setPartitionTouchspinValue,
}) => {
  const minValue = 1;

  const { t } = useTranslation();

  const handleOnPlus = () => {
    setPartitionTouchspinValue(partitionTouchspinValue + 1);
  };
  const handleOnMinus = () => {
    setPartitionTouchspinValue(partitionTouchspinValue - 1);
  };
  const handlePartitionTouchspinChange = (event) => {
    let num = Number(event.target.value);
    if (num < minValue) {
      num = minValue;
    }
    setPartitionTouchspinValue(num);
  };

  return (
    <Stack hasGutter className='kafka-ui--wizard-main-body__stack'>
      <TextContent>
        <Text component={TextVariants.h2}>Partitions</Text>
        <Text component={TextVariants.p}>{t('topic.partition_info')}</Text>
        <Text component={TextVariants.small}>
          {t('topic.partition_info_note')}
        </Text>
      </TextContent>
      <Form>
        <FormGroup
          label='Partitions'
          fieldId='step-topic-name-form'
          helperText={t('topic.partition_helper_text')}
          isRequired
        >
          <NumberInput
            onPlus={handleOnPlus}
            onMinus={handleOnMinus}
            value={partitionTouchspinValue}
            inputName='input'
            onChange={handlePartitionTouchspinChange}
            widthChars={20}
            min={minValue}
          />
        </FormGroup>
      </Form>
    </Stack>
  );
};
