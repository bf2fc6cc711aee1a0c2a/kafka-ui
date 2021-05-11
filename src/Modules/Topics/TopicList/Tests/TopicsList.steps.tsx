import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TopicsListComponent } from '../Components/TopicsList';
import { BrowserRouter as Router } from 'react-router-dom';

import { Topic, TopicsList } from '../../../../OpenApi';
import { IConfiguration } from '../../../../Contexts';

jest.mock('Services');
import { getTopics } from '../../../../Services';

describe('<TopicsListComponent />', () => {
  // Skipped as this test suite wastaking an unusuallly long time.
  // TODO: re-instate this test case
  xit('should render a list of topics', async () => {
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
        <Router>
          <TopicsListComponent
            onCreateTopic={() => {
              return;
            }}
            onClickTopic={() => {
              return;
            }}
            getTopicDetailsPath={() => {
              return '';
            }}
            onDeleteTopic={() => {
              return;
            }}
          />
        </Router>
      );

      const createBtn = getByText('Create topic');

      fireEvent.click(createBtn);
    });
  });
});
