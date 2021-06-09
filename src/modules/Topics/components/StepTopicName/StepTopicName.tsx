import React from "react";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormGroup,
  TextContent,
  Text,
  TextVariants,
  TextInput,
  FormSection,
} from "@patternfly/react-core";
import "../CreateTopicWizard/CreateTopicWizard.css";
export type StepTopicNameProps = {
  topicData: any;
  setTopicData: (value: any) => void;
  topicNameValidated: "error" | "default";
  setTopicNameValidated: (value: "error" | "default") => void;
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

  const topicNameInput = topicData && topicData["name"];

  const validationCheck = (topicNameInput) => {
    const legalNameChars = new RegExp('^[a-zA-Z0-9._-]+$');
    if (topicNameInput.length && !legalNameChars.test(topicNameInput)) {
      setInvalidText(t("topic.topic_name_helper_text"));
      setTopicNameValidated("error");
    } else if (topicNameInput.length > 249) {
      setTopicNameValidated("error");
      setInvalidText(t("topic.cannot_exceed_characters"));
    } else if (topicNameInput === '.' || topicNameInput === '..') {
      setTopicNameValidated('error');
      setInvalidText(t('topic.invalid_name_with_dot'));
    } else setTopicNameValidated("default");
  };

  const handleTopicNameChange = (value) => {
    validationCheck(value);
    setTopicData({ ...topicData, name: value });
  };

  const preventFormSubmit = (event) => event.preventDefault();

  return (
    <Form onSubmit={preventFormSubmit}>
      <FormSection
        title={t("topic.topic_name")}
        id="topic-name"
        titleElement={"h2"}
      >
        <TextContent>
          <Text component={TextVariants.p}>{t("topic.topic_name_info")}</Text>
          <Text component={TextVariants.small}>
            {t("topic.topic_name_info_note")}
          </Text>
        </TextContent>
        <FormGroup
          label={t("topic.topic_name")}
          fieldId="step-topic-name-form"
          helperText={t("topic.topic_name_helper_text")}
          helperTextInvalid={invalidText}
          validated={topicNameValidated}
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="step-topic-name-input"
            name="step-topic-name"
            value={topicNameInput}
            onChange={handleTopicNameChange}
            placeholder={t("topic.enter_name")}
            validated={topicNameValidated}
          />
        </FormGroup>
      </FormSection>
    </Form>
  );
};
