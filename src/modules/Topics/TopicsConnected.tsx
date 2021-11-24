import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { Topics } from './Topics';
import { MainViewHeader } from '@app/components';

const TopicsConnected: React.FC = () => {
  return (
    <>
      <MainViewHeader activeTabKey={2} />
      <PageSection isFilled>
        <Topics />
      </PageSection>
    </>
  );
};

export { TopicsConnected };
