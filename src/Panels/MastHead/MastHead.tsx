import React from 'react';
import { Page } from '@patternfly/react-core';
import { AppMastHead } from '../../Modules/AppNavigation/AppMastHead';

export type MastHeadProps = {
  children: React.ReactNode;
};

export const MastHead: React.FC<MastHeadProps> = ({ children }) => {
  return (
    <Page mainContainerId='scrollablePageMain' header={<AppMastHead />}>
      {children}
    </Page>
  );
};
