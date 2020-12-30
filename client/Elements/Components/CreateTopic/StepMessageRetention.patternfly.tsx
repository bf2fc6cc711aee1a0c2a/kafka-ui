/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useEffect, useState } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Radio,
  Select,
  SelectOption,
  SelectVariant,
  TextContent,
  Text,
  TextVariants,
  Touchspin,
} from "@patternfly/react-core";
import "./CreateTopicWizard.patternfly.css";

interface IStepMessageRetention {
  setMsgRetentionValue: (value: number) => void;
}

export const StepMessageRetention: React.FC<IStepMessageRetention> = ({
  setMsgRetentionValue,
}) => {
  enum RetentionOption {
    DAY = "days",
    WEEK = "weeks",
    MONTH = "months",
    CUSTOM = "custom",
  }
  const [currentPeriod, setCurrentPeriod] = React.useState<string>(
    RetentionOption.DAY
  );
  const [msgTouchspinValue, setMsgTouchspinValue] = useState(7);
  const [isMsgSelectOpen, setIsMsgSelectOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [retentionFactor, setRetentionFactor] = useState(1);

  useEffect(() => {
    if (currentPeriod === RetentionOption.DAY) {
      setMsgRetentionValue(1);
    } else if (currentPeriod === RetentionOption.WEEK) {
      setMsgRetentionValue(7);
    } else if (currentPeriod === RetentionOption.MONTH) {
      setMsgRetentionValue(30);
    } else if (currentPeriod === RetentionOption.CUSTOM) {
      setMsgRetentionValue(retentionFactor * msgTouchspinValue);
    }
  }, [currentPeriod, msgTouchspinValue, retentionFactor]);

  const handleMessageRetention = (checked, event) => {
    const target = event.target;
    const name = target.name;

    if (name === "radio1") {
      setCurrentPeriod(RetentionOption.DAY);
    } else if (name === "radio2") {
      setCurrentPeriod(RetentionOption.WEEK);
    } else if (name === "radio3") {
      setCurrentPeriod(RetentionOption.MONTH);
    } else if (name === "radio4") {
      setCurrentPeriod(RetentionOption.CUSTOM);
    }
  };

  const onMsgToggle = (isMsgSelectOpen) => {
    setIsMsgSelectOpen(isMsgSelectOpen);
  };

  const onMsgSelect = (event, selection) => {
    if (selection === "days") {
      setRetentionFactor(1);
    } else if (selection === "weeks") {
      setRetentionFactor(7);
    } else if (selection === "months") {
      setRetentionFactor(30);
    }
    setSelected(selection);
    setIsMsgSelectOpen(false);
  };

  const handlePlusClick = () => {
    setMsgTouchspinValue(msgTouchspinValue + 1);
  };

  const handleMinusClick = () => {
    setMsgTouchspinValue(msgTouchspinValue - 1);
  };

  const handleMsgTouchSpinChange = (event) => {
    setMsgTouchspinValue(Number(event.target.value));
  };

  return (
    <>
      <TextContent className="topics-wizard-content">
        <Text component={TextVariants.h2}>Message retention</Text>
        <Text component={TextVariants.p}>
          This is how long messages are retained before they are deleted.
        </Text>
        <Text component={TextVariants.small}>
          If your messages are not read by a consumer within this time, they
          will be missed.
        </Text>
      </TextContent>
      <Form className="form-in-wizard">
        <FormGroup
          fieldId="form-group-in-wizard"
          label="Message retention"
          className="form-group-radio"
        >
          <Radio
            isChecked={currentPeriod === RetentionOption.DAY}
            name="radio1"
            onChange={handleMessageRetention}
            label="A day"
            id="radio-controlled-1"
            value="day"
          />
          <Radio
            isChecked={currentPeriod === RetentionOption.WEEK}
            name="radio2"
            onChange={handleMessageRetention}
            label="A week"
            id="radio-controlled-2"
            value="week"
          />
          <Radio
            isChecked={currentPeriod === RetentionOption.MONTH}
            name="radio3"
            onChange={handleMessageRetention}
            label="A month"
            id="radio-controlled-3"
            value="month"
          />
          <Radio
            isChecked={currentPeriod === RetentionOption.CUSTOM}
            name="radio4"
            onChange={handleMessageRetention}
            label=""
            id="radio-controlled-4"
            value="custom"
          />
          <div className="radio-description radio-step-3">
            <Flex>
              <FlexItem>
                <Touchspin
                  onMinus={handleMinusClick}
                  onPlus={handlePlusClick}
                  value={msgTouchspinValue}
                  onChange={handleMsgTouchSpinChange}
                />
              </FlexItem>
              <FlexItem>
                <Select
                  variant={SelectVariant.single}
                  aria-label="Select Input"
                  onToggle={onMsgToggle}
                  onSelect={onMsgSelect}
                  selections={selected}
                  isOpen={isMsgSelectOpen}
                  // aria-labelledby={titleId}
                >
                  <SelectOption key={0} value="days" isPlaceholder />
                  <SelectOption key={1} value="weeks" />
                  <SelectOption key={2} value="months" />
                </Select>
              </FlexItem>
            </Flex>
          </div>
        </FormGroup>
      </Form>
    </>
  );
};
