import React, { ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import { render, RenderResult } from "@testing-library/react";
import { Given, When, Then, Fusion } from "jest-cucumber-fusion";
import { TopicDetailView, TopicViewDetailProps } from "./TopicDetailView";
import kafkai18n from "@test-utils/i18n";
import { IAdvancedTopic } from "@app/modules/Topics/components/CreateTopicWizard";

let renderResult: RenderResult;
let component: ReactElement;

const topic: IAdvancedTopic = {
  name: "topic-1",
  numPartitions: "",
  "retention.ms": "",
  "retention.ms.unit": "milliseconds",
  "retention.bytes": "",
  "retention.bytes.unit": "bytes",
  "cleanup.policy": "",
};

const updateTopic = jest.fn();
const deleteTopic = jest.fn();

const props: TopicViewDetailProps = {
  topic,
  updateTopic,
  deleteTopic,
};

Given("the topic detail view component", () => {
  component = (
    <I18nextProvider i18n={kafkai18n}>
      <TopicDetailView {...props} />
    </I18nextProvider>
  );
});

When("it is rendered", () => {
  renderResult = render(component);
});

Then("it should display the expected text", () => {
  const { getByText } = renderResult;
  expect(getByText("JUMP TO SECTION")).toBeInTheDocument();
});

Fusion("TopicDetailView.feature");
