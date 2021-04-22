import React, { useState } from 'react';
import { CreateTopichead } from './Components/CreateTopicHead';
import { CreateTopicWizard } from './Components/CreateTopicWizard';

interface ICreateTopicPageProps {
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  setIsCreateTopic?: (value: boolean) => void;
  onCloseCreateTopic: () => void
}

export const CreateTopicPage: React.FC<ICreateTopicPageProps> = ({
  setIsCreateTopic,
  kafkaInstanceLink,
  kafkaName,
  kafkaPageLink
  onCloseCreateTopic
}) => {
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);
  return (
    <>
      <CreateTopichead
        isSwitchChecked={isSwitchChecked}
        setIsSwitchChecked={setIsSwitchChecked}
        kafkaName={kafkaName}
        kafkaInstanceLink={kafkaInstanceLink}
        kafkaPageLink={kafkaPageLink}
      />
      <CreateTopicWizard
        isSwitchChecked={isSwitchChecked}
        setIsCreateTopic={setIsCreateTopic}
        onCloseCreateTopic={onCloseCreateTopic}
      />
    </>
  );
};
