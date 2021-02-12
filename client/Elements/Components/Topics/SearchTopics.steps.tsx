/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import { render } from '@testing-library/react';
import { SearchTopics } from './SearchTopics.patternfly';
import { ISearchTopicsProps } from './SearchTopics.patternfly';

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
