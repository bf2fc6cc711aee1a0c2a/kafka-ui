/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TopicsList } from './TopicsList.patternfly';

describe('<TopicsList />', () => {
  it('should render a list of topics', () => {
    const { getByText } = render(
      <TopicsList
        onCreateTopic={() => {
          return;
        }}
      />
    );

    const titleNode = getByText('Topics');

    const createBtn = getByText('Create Topic');

    expect(titleNode).toBeInTheDocument();

    fireEvent.click(createBtn);
  });
});
