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
import './CreateTopicWizard.css';
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
        <Text component={TextVariants.h2}>Topic name</Text>
        <Text component={TextVariants.p}>
          Unique name used to recognize your topic
        </Text>
        <Text component={TextVariants.small}>
          The topic name is also used by your producers and consumers as part of
          the connection information, so make it something easy to recognize.
        </Text>
      </TextContent>
      <Form onSubmit={preventFormSubmit}>
        <FormGroup
          label='Topic name'
          fieldId='step-topic-name-form'
          helperText='Must be letters (Aa-Zz), numbers, underscores( _ ), or hyphens ( - ).'
          helperTextInvalid={invalidText}
          validated={topicNameValidated}
          isRequired
        >
          <TextInput
            isRequired
            type='text'
            id='step-topic-name-input'
            name='step-topic-name'
            aria-describedby='step-topic-name-helper'
            value={topicNameInput}
            onChange={handleTopicNameChange}
            placeholder={t('createTopic.enterName')}
            validated={topicNameValidated}
          />
        </FormGroup>
      </Form>
    </Stack>
  );
};
