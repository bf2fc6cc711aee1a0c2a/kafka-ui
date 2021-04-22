import React, { useState } from 'react';
import { CreateTopichead } from './Components/CreateTopicHead';
import { CreateTopicWizard } from './Components/CreateTopicWizard';

interface ICreateTopicPageProps {
  setIsCreateTopic?: (value: boolean) => void;
  onCloseCreateTopic: () => void
}

export const CreateTopicPage: React.FC<ICreateTopicPageProps> = ({
  setIsCreateTopic,
  onCloseCreateTopic
}) => {
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);
  return (
    <>
      <CreateTopichead
        isSwitchChecked={isSwitchChecked}
        setIsSwitchChecked={setIsSwitchChecked}
      />
      <CreateTopicWizard
        isSwitchChecked={isSwitchChecked}
        setIsCreateTopic={setIsCreateTopic}
        onCloseCreateTopic={onCloseCreateTopic}
      />
    </>
  );
};
