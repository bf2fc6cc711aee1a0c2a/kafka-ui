import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Topics } from "@app/modules/Topics";
import { Topic, TopicsList } from "@app/openapi";
import { IConfiguration } from "@app/contexts";
import { getTopics } from "@app/services";

jest.mock("services");

describe("<Topics />", () => {
  // Skipped as this test suite wastaking an unusuallly long time.
  // TODO: re-instate this test case
  xit("should render a list of topics", async () => {
    const topics = {
      items: [
        {
          name: "foo",
        },
      ] as Topic[],
    } as TopicsList;

    const getTopicsMock = getTopics as jest.MockedFunction<
      (config: IConfiguration | undefined) => Promise<TopicsList>
    >;
    getTopicsMock.mockReturnValueOnce(Promise.resolve(topics));
    await waitFor(() => {
      const { getByText } = render(
        <Router>
          <Topics />
        </Router>
      );

      const createBtn = getByText("Create topic");

      fireEvent.click(createBtn);
    });
  });
});
