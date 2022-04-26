import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { MainViewHeader } from '@app/components';
import { PermissionsTableView } from '@app/modules/Permissions/pages/PermissionsTable/PermissionsTableView';

const PermissionsConnected: React.FC = () => {
  return (
    <>
      <MainViewHeader activeTabKey={4} />
      <PageSection hasOverflowScroll={true}>
        <PermissionsTableView kafkaName={'test'} />
      </PageSection>
    </>
  );
};

export { PermissionsConnected };
