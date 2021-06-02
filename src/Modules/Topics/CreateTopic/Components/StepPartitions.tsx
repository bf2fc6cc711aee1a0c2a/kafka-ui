import React from 'react';
import {
  TextContent,
  Text,
  TextVariants,
  NumberInput,
  FormGroup,
  Form,
  Stack,
  FormSection,
} from '@patternfly/react-core';
import './CreateTopicWizard.css';
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
    <Form>
      <FormSection
        title={t('topic.partitions')}
        id='partitions'
        titleElement={'h2'}
      >
      <TextContent>
        <Text component={TextVariants.p}>{t('topic.partition_info')}</Text>
        <Text component={TextVariants.small}>
          {t('topic.partition_info_note')}
        </Text>
      </TextContent>

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
      </FormSection>
    </Form>
  );
};
