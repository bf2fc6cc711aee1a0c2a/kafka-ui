import React from "react";
import { Page } from "@patternfly/react-core";
import { AppMastHead } from "@app/components/AppNavigation";

export type MastHeadProps = {
  children: React.ReactNode;
};

export const MastHead: React.FC<MastHeadProps> = ({ children }) => {
  return (
    <Page mainContainerId="scrollablePageMain" header={<AppMastHead />}>
      {children}
    </Page>
  );
};
