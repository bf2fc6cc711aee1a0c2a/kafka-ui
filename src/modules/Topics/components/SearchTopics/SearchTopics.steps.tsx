import React from 'react';
import { render } from '@testing-library/react';
import { SearchTopics } from './SearchTopics';
import { ISearchTopicsProps } from './SearchTopics';

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
