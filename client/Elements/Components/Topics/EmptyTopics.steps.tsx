/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { EmptyTopics } from './EmptyTopics.patternfly';
import { MemoryRouter } from 'react-router';

describe('<EmptyTopics />', () => {
  it('should render an empty state if filters return no result', () => {
    const { getByText } = render(
      <MemoryRouter>
        <EmptyTopics />
      </MemoryRouter>
    );

    const titleNode = getByText("You don't have any topics yet");
    const bodyNode = getByText(
      'Create a topic by clicking the button below to get started'
    );
    const clearBtn = getByText('Create Topic');

    expect(titleNode).toBeInTheDocument();
    expect(bodyNode).toBeInTheDocument();
    fireEvent.click(clearBtn);
  });
});
