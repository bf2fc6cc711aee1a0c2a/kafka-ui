/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import { render } from '@testing-library/react';
import { EmptySearch } from './EmptySearch.patternfly';

describe('<EmptySearch />', () => {
  it('should render an empty state if filters return no result', () => {
    const { getByText } = render(<EmptySearch />);

    const titleNode = getByText('No results found');

    expect(titleNode).toBeInTheDocument();
  });
});
