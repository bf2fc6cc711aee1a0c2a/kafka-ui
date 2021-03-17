import React from 'react';
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
export interface IStepTopicName {
  topicNameInput: string;
  setTopicNameInput: (value: string) => void;
}

export const StepTopicName: React.FC<IStepTopicName> = ({
  topicNameInput,
  setTopicNameInput,
}) => {
  const handleTopicNameChange = (topicNameInput) => {
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
            placeholder='Enter topic name'
          />
        </FormGroup>
      </Form>
    </Stack>
  );
};
