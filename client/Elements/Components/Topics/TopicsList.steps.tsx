/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TopicsListComponent } from './TopicsList.patternfly';

import { Topic, TopicsList } from '../../../OpenApi';
import { IConfiguration } from '../../../Contexts';

jest.mock('../../../Services');
import { getTopics } from '../../../Services';

describe('<TopicsList />', () => {
  it('should render a list of topics', async () => {
    const topics = {
      items: [
        {
          name: 'foo',
        },
      ] as Topic[],
    } as TopicsList;

    const getTopicsMock = getTopics as jest.MockedFunction<
      (config: IConfiguration | undefined) => Promise<TopicsList>
    >;
    getTopicsMock.mockReturnValueOnce(Promise.resolve(topics));

    const { getByText } = render(
      <TopicsListComponent
        onCreateTopic={() => {
          return;
        }}
      />
    );

    await waitFor(() => expect(getByText('Topics')).toBeInTheDocument());

    const titleNode = getByText('Topics');

    const createBtn = getByText('Create topic');

    expect(titleNode).toBeInTheDocument();

    fireEvent.click(createBtn);
  });
});
