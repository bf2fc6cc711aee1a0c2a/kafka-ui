import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TopicsListComponent } from '../Components/TopicsList';

import { Topic, TopicsList } from '../../../../OpenApi';
import { IConfiguration } from '../../../../Contexts';

jest.mock('Services');
import { getTopics } from '../../../../Services';

describe('<TopicsListComponent />', () => {
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
    await waitFor(() => {
      const { getByText } = render(
        <TopicsListComponent
          onCreateTopic={() => {
            return;
          }}
          onTopicClick={() => {
            return;
          }}
        />
      );

      const createBtn = getByText('Create topic');

      fireEvent.click(createBtn);
    });
  });
});
