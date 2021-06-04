import React, { ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import { render, RenderResult } from "@testing-library/react";
import {
  TopicAdvanceConfigProps,
  TopicAdvanceConfig,
} from "./TopicAdvanceConfig";
import kafkai18n from "@test-utils/i18n";
import { IAdvancedTopic } from "@app/modules/Topics/components/CreateTopicWizard";

const setup = () => {
  const topicData: IAdvancedTopic = {
    name: "topicName",
    "cleanup.policy": "Delete",
    numPartitions: "2",
    "retention.ms": "1000",
    "retention.bytes": "-1",
  };
  const topicadvanceConfigProps: TopicAdvanceConfigProps = {
    isCreate: true,
    saveTopic: jest.fn(),
    handleCancel: jest.fn(),
    topicData,
    setTopicData: jest.fn(),
  };
  const component: ReactElement = (
    <I18nextProvider i18n={kafkai18n}>
      <TopicAdvanceConfig {...topicadvanceConfigProps} />
    </I18nextProvider>
  );
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe("<TopicAdvancedConfig />", () => {
  it("should render topicadvancedConfig", () => {
    const renderResult = setup();
    const { getByText } = renderResult;
    expect(getByText("JUMP TO SECTION")).toBeInTheDocument();
  });
});
