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
    const bodyNode = getByText(
      ' No result match the filter criteria. Remove filter or clear all filtrs to show results'
    );

    expect(titleNode).toBeInTheDocument();
    expect(bodyNode).toBeInTheDocument();
  });
});
