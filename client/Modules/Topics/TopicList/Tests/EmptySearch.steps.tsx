import React from 'react';
import { render } from '@testing-library/react';
import { EmptySearch } from '../Components/EmptySearch.patternfly';

describe('<EmptySearch />', () => {
  it('should render an empty state if filters return no result', () => {
    const { getByText } = render(<EmptySearch />);

    const titleNode = getByText('No results found');

    expect(titleNode).toBeInTheDocument();
  });
});
