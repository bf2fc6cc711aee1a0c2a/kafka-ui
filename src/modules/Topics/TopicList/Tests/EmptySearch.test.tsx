import React from 'react';
import { render } from '@testing-library/react';
import { EmptySearch } from '../Components/EmptySearch';
import { I18nextProvider } from 'react-i18next';
import kafkai18n from '../../../../../test-utils/i18n';

describe('<EmptySearch />', () => {
  it('should render an empty state if filters return no result', () => {
    const { getByText } = render(
      <I18nextProvider i18n={kafkai18n}>
        <EmptySearch />
      </I18nextProvider>
    );

    const titleNode = getByText('No results found');

    expect(titleNode).toBeInTheDocument();
  });
});
