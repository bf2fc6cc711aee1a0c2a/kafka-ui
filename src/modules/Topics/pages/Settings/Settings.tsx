import { PageSection } from '@patternfly/react-core';
import React from 'react';
import { MainViewHeader } from '@app/components';
import { FederatedProps, FederatedContext } from '@app/contexts';

export type SettingsProps = FederatedProps;

const Settings: React.FC<SettingsProps> = ({
  showSettings,
  kafkaName,
  kafkaPageLink,
  kafka,
}) => {
  return (
    <FederatedContext.Provider
      value={{
        kafkaName,
        kafkaPageLink,
        kafka,
        showSettings,
      }}
    >
      <MainViewHeader activeTabKey={5} />
      <PageSection padding={{ default: 'noPadding' }}>
        {showSettings}
      </PageSection>
    </FederatedContext.Provider>
  );
};

export { Settings };
export default Settings;
