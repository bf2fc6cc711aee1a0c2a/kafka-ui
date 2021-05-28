import React from "react";
import { render } from "@testing-library/react";
import {
  SearchTopics,
  ISearchTopicsProps,
} from "@app/modules/Topics/components/SearchTopics/SearchTopics";

describe("<SearchTopics />", () => {
  const props: ISearchTopicsProps = {
    setSearch: jest.fn(),
    search: "Search",
    setFilteredTopics: jest.fn(),
    setSearchTopicName: jest.fn(),
  };
  xit("should render a search input", () => {
    const { getByText } = render(<SearchTopics {...props} />);

    const bodyNode = getByText("Search");

    expect(bodyNode).toBeInTheDocument();
  });
});
