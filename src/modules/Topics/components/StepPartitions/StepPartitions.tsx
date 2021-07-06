import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextContent,
  Text,
  TextVariants,
  NumberInput,
  FormGroup,
  Form,
  FormSection,
} from '@patternfly/react-core';
import '../CreateTopicWizard/CreateTopicWizard.css';
import { MIN_PARTITIONS, MAX_PARTITIONS } from '@app/constant';

export type StepPartitionsProps = {
  setPartitionTouchspinValue: (value: number) => void;
  partitionTouchspinValue: number;
};

export const StepPartitions: React.FC<StepPartitionsProps> = ({
  partitionTouchspinValue,
  setPartitionTouchspinValue,
}) => {
  const { t } = useTranslation();

  const handleOnPlus = () => {
    setPartitionTouchspinValue(partitionTouchspinValue + 1);
  };
  const handleOnMinus = () => {
    setPartitionTouchspinValue(partitionTouchspinValue - 1);
  };
  const handlePartitionTouchspinChange = (event) => {
    let num = Number(event.target.value);
    if (num < MIN_PARTITIONS) {
      num = MIN_PARTITIONS;
    } else if (num > MAX_PARTITIONS) {
      num = MAX_PARTITIONS;
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
            min={MIN_PARTITIONS}
            max={MAX_PARTITIONS}
          />
        </FormGroup>
      </FormSection>
    </Form>
  );
};
