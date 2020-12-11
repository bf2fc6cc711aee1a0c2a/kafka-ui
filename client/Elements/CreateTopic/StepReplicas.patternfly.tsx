/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import {
  Form,
  FormGroup,
  Radio,
  TextContent,
  Text,
  TextVariants,
  Touchspin,
} from "@patternfly/react-core";
import "./CreateTopicWizard.patternfly.css";

interface IStepReplicas {
  setReplicationFactorTouchspinValue: (value: number) => void;
  setMinInSyncReplicaTouchspinValue: (value: number) => void;
  replicationFactorTouchspinValue: number;
  minInSyncReplicaTouchspinValue: number;
}

export const StepReplicas: React.FC<IStepReplicas> = ({
  setReplicationFactorTouchspinValue,
  setMinInSyncReplicaTouchspinValue,
  replicationFactorTouchspinValue,
  minInSyncReplicaTouchspinValue,
}) => {
  const [radio1Step4, setRadio1Step4] = useState(false);
  const [radio2Step4, setRadio2Step4] = useState(false);
  const [radio3Step4, setRadio3Step4] = useState(false);

  const handleChangeStep4 = (checked, event) => {
    setRadio1Step4(false);
    setRadio2Step4(false);
    setRadio3Step4(false);

    const target = event.target;
    const name = target.name;

    if (name === "radio4") {
      setRadio1Step4(true);
      setMinInSyncReplicaTouchspinValue(1);
      setReplicationFactorTouchspinValue(1);
    } else if (name === "radio5") {
      setRadio2Step4(true);
      setMinInSyncReplicaTouchspinValue(2);
      setReplicationFactorTouchspinValue(2);
    } else if (name === "radio6") {
      setRadio3Step4(true);
      setMinInSyncReplicaTouchspinValue(minInSyncReplicaTouchspinValue);
      setReplicationFactorTouchspinValue(replicationFactorTouchspinValue);
    }
  };

  const handleOnPlusReplicationFactorFactor = () => {
    setReplicationFactorTouchspinValue(replicationFactorTouchspinValue + 1);
  };
  const handleOnMinusReplicationFactorFactor = () => {
    setReplicationFactorTouchspinValue(replicationFactorTouchspinValue - 1);
  };
  const handleReplicationFactorChange = (event) => {
    setReplicationFactorTouchspinValue(Number(event.target.value));
  };

  const handleOnPlusMinInSyncReplicaFactor = () => {
    setMinInSyncReplicaTouchspinValue(minInSyncReplicaTouchspinValue + 1);
  };
  const handleOnMinusMinInSyncReplicaFactor = () => {
    setMinInSyncReplicaTouchspinValue(minInSyncReplicaTouchspinValue - 1);
  };
  const handleMinInSyncReplicaChange = (event) => {
    setMinInSyncReplicaTouchspinValue(Number(event.target.value));
  };

  return (
    <>
      <TextContent className="topics-wizard-content">
        <Text component={TextVariants.h2}>Replicas</Text>
        <Text component={TextVariants.p}>
          This is how many copies of a topic will be made for high availability.
        </Text>
        <Text component={TextVariants.small}>
          The partitions of each topic can be replicated across a configurable
          number of brokers.
        </Text>
        <Form>
          <FormGroup
            fieldId="create-wizard-replica-form-group"
            label="Replicas"
            className="form-group-radio"
          >
            <Radio
              isChecked={radio1Step4}
              name="radio4"
              onChange={handleChangeStep4}
              label="Replication factor: 1"
              id="radio-controlled-4"
              value="radio4"
              description="Minimum in-sync replicas: 1"
            />
            <Radio
              isChecked={radio2Step4}
              name="radio5"
              onChange={handleChangeStep4}
              label="Replication factor: 2"
              id="radio-controlled-5"
              value="radio5"
              description="Minimum in-sync replicas: 2"
            />
            <Radio
              isChecked={radio3Step4}
              name="radio6"
              onChange={handleChangeStep4}
              label="Replication factor"
              id="radio-controlled-6"
              value="radio6"
            />
            <div className="radio-description">
              <Touchspin
                value={replicationFactorTouchspinValue}
                onMinus={handleOnMinusReplicationFactorFactor}
                onPlus={handleOnPlusReplicationFactorFactor}
                onChange={handleReplicationFactorChange}
              />
              <Text
                component={TextVariants.small}
                className="minimum-in-sync-replicas"
              >
                Minimum in-sync replicas
              </Text>
              <Touchspin
                value={minInSyncReplicaTouchspinValue}
                onMinus={handleOnMinusMinInSyncReplicaFactor}
                onPlus={handleOnPlusMinInSyncReplicaFactor}
                onChange={handleMinInSyncReplicaChange}
              />
            </div>
          </FormGroup>
        </Form>
      </TextContent>
    </>
  );
};
