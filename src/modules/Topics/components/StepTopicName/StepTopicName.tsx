import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormGroup,
  FormSection,
  Text,
  TextContent,
  TextInput,
  TextVariants,
} from '@patternfly/react-core';
import { IAdvancedTopic } from '@app/modules/Topics/utils';
import { useValidateTopic } from '@app/modules/Topics/utils';
import '../CreateTopicWizard/CreateTopicWizard.css';

export type StepTopicNameProps = {
  topicData: IAdvancedTopic;
  setTopicData: (value: IAdvancedTopic) => void;
  topicNameValidated: 'error' | 'default';
  setTopicNameValidated: (value: 'error' | 'default') => void;
  invalidText: string;
  setInvalidText: (value: string) => void;
};

export const StepTopicName: React.FC<StepTopicNameProps> = ({
  topicData,
  setTopicData,
  topicNameValidated,
  setTopicNameValidated,
  invalidText,
  setInvalidText,
}) => {
  const { t } = useTranslation();
  const { validateName } = useValidateTopic();

  const topicNameInput = topicData && topicData.name;

  useEffect(() => {
    validationCheck(topicNameInput);
  }, [topicData.name]);

  const validationCheck = (inputValue: string) => {
    const errorMessage = validateName(inputValue);
    if (errorMessage) {
      setInvalidText(errorMessage);
      setTopicNameValidated('error');
    } else {
      setTopicNameValidated('default');
    }
  };

  const handleTopicNameChange = (value) => {
    validationCheck(value);
    setTopicData({ ...topicData, name: value });
  };

  const preventFormSubmit = (event) => event.preventDefault();

  return (
    <Form onSubmit={preventFormSubmit}>
      <FormSection
        title={t('topic.topic_name')}
        id='topic-name'
        titleElement={'h2'}
      >
        <TextContent>
          <Text component={TextVariants.p}>{t('topic.topic_name_info')}</Text>
          <Text component={TextVariants.small}>
            {t('topic.topic_name_info_note')}
          </Text>
        </TextContent>
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
      </FormSection>
    </Form>
  );
};
