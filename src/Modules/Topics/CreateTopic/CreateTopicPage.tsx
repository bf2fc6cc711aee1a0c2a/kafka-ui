import React, { useState } from 'react';
import { CreateTopichead } from './Components/CreateTopicHead';
import { CreateTopicWizard } from './Components/CreateTopicWizard';

interface ICreateTopicPageProps {
  setIsCreateTopic?: (value: boolean) => void;
}

export const CreateTopicPage: React.FC<ICreateTopicPageProps> = ({
  setIsCreateTopic,
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
      />
    </>
  );
};
