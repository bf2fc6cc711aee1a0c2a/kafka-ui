import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  TextContent,
  Text,
  TextVariants,
  TextInput,
  Stack,
} from '@patternfly/react-core';
import "../CreateTopicWizard/CreateTopicWizard.css";
import { useTranslation } from 'react-i18next';
export interface IStepTopicName {
  topicNameInput: string;
  setTopicNameInput: (value: string) => void;
  topicNameValidated: 'error' | 'default';
  setTopicNameValidated: (value: 'error' | 'default') => void;
}

export const StepTopicName: React.FC<IStepTopicName> = ({
  topicNameInput,
  setTopicNameInput,
  topicNameValidated,
  setTopicNameValidated,
}) => {
  const [invalidText, setInvalidText] = useState('This is a required field');

  const { t } = useTranslation();

  const validationCheck = (topicNameInput) => {
    const regexpInvalid = new RegExp('^[0-9A-Za-z_-]+$');
    if (topicNameInput.length && !regexpInvalid.test(topicNameInput)) {
      setInvalidText(
        'Invalid input. Only letters (Aa-Zz) , numbers " _ " and " - " are accepted.'
      );
      setTopicNameValidated('error');
    } else if (topicNameInput.length < 1) {
      setInvalidText('This is a required field');
      setTopicNameValidated('error');
    } else if (topicNameInput.length > 249) {
      setTopicNameValidated('error');
      setInvalidText('Topic name cannot exceed 249 characters');
    } else setTopicNameValidated('default');
  };

  const handleTopicNameChange = (topicNameInput) => {
    validationCheck(topicNameInput);
    setTopicNameInput(topicNameInput);
  };

  const preventFormSubmit = (event) => event.preventDefault();

  return (
    <Stack hasGutter className='kafka-ui--wizard-main-body__stack'>
      <TextContent>
        <Text component={TextVariants.h2}>{t('topic.topic_name')}</Text>
        <Text component={TextVariants.p}>{t('topic.topic_name_info')}</Text>
        <Text component={TextVariants.small}>
          {t('topic.topic_name_info_note')}
        </Text>
      </TextContent>
      <Form onSubmit={preventFormSubmit}>
        <FormGroup
          label={t('topic.topic_name')}
          fieldId='step-topic-name-form'
          helperText={t('topic.topic_name_helper_text')}
          helperTextInvalid={invalidText}
          validated={topicNameValidated}
          isRequired
        >
          <TextInput
            isRequired
            type='text'
            id='step-topic-name-input'
            name='step-topic-name'
            value={topicNameInput}
            onChange={handleTopicNameChange}
            placeholder={t('topic.enter_name')}
            validated={topicNameValidated}
          />
        </FormGroup>
      </Form>
    </Stack>
  );
};
