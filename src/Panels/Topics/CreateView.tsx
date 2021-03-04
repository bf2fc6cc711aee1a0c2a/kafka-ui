import React, { FunctionComponent } from 'react';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { CreateTopicWizard } from '../../Modules/Topics/CreateTopic/Components/CreateTopicWizard';
import { useHistory } from 'react-router-dom';

const CreateTopic: FunctionComponent = () => {
  const history = useHistory();

  return (
    <CreateTopicWizard
      setIsCreateTopic={(value) => {
        if (!value) {
          history.goBack();
        }
      }}
    />
  );
};

export { CreateTopic };

export default CreateTopic;
