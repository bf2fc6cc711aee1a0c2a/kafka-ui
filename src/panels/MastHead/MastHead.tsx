import React from "react";
import { Page } from "@patternfly/react-core";
import { AppLayout } from "@app/components/AppLayout";

export type MastHeadProps = {
  children: React.ReactNode;
};

export const MastHead: React.FC<MastHeadProps> = ({ children }) => {
  return (
    <Page mainContainerId="main-container" header={<AppLayout />}>
      {children}
    </Page>
  );
};
