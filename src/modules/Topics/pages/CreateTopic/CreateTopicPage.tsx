import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useBasename } from '@rhoas/app-services-ui-shared';
import {
  CreateTopichead,
  CreateTopicWizard,
} from '@app/modules/Topics/components';
import { useFederated } from '@app/contexts';
import '../style.css';

export const CreateTopicPage: React.FC = () => {
  const { kafkaName, kafkaPageLink, kafkaInstanceLink } = useFederated() || {};
  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();

  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);

  const onCloseCreateTopic = () => {
    history.push(`${basename}/topics`);
  };

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
        onCloseCreateTopic={onCloseCreateTopic}
      />
    </>
  );
};
