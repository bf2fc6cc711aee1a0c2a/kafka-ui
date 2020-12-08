/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import {
  Form,
  FormGroup,
  TextContent,
  Text,
  TextVariants,
  TextInput,
} from "@patternfly/react-core";

interface IStepTopicName {
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
  return (
    <>
      <TextContent className="topics-wizard-content">
        <Text component={TextVariants.h2}>Topic name</Text>
        <Text component={TextVariants.p}>
          This is the unique name used to recognize your topic.
        </Text>
        <Text component={TextVariants.small}>
          It will also be used by your producers and consumers as part of the
          connection information, so make it something easy to recognize.
        </Text>
        <Form>
          <FormGroup
            label="Topic name"
            fieldId="simple-form-name"
            // helperText="Please enter your topic name"
          >
            <TextInput
              isRequired
              type="text"
              id="simple-form-name"
              name="simple-form-name"
              aria-describedby="simple-form-name-helper"
              value={topicNameInput}
              onChange={handleTopicNameChange}
              placeholder="Enter topic name"
            />
          </FormGroup>
        </Form>
      </TextContent>
    </>
  );
};
