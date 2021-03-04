import React from 'react';
import { render } from '@testing-library/react';
import { SearchTopics } from 'Modules/Topics/TopicList/Components/SearchTopics';
import { ISearchTopicsProps } from 'Modules/Topics/TopicList/Components/SearchTopics';

describe('<SearchTopics />', () => {
  const props: ISearchTopicsProps = {
    setSearch: jest.fn(),
    search: 'Search',
    onClear: jest.fn(),
  };
  xit('should render a search input', () => {
    const { getByText } = render(<SearchTopics {...props} />);

    const bodyNode = getByText('Search');

    expect(bodyNode).toBeInTheDocument();
  });
});
