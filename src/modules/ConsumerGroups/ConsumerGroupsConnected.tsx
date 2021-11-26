import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { ConsumerGroups } from './ConsumerGroups';
import { MainViewHeader } from '@app/components';

const ConsumerGroupsConnected: React.FC = () => {
  return (
    <>
      <MainViewHeader activeTabKey={3} />
      <PageSection isFilled>
        <ConsumerGroups consumerGroupByTopic={false} />
      </PageSection>
    </>
  );
};
export { ConsumerGroupsConnected };
