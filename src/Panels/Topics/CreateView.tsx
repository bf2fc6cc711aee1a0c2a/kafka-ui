import React, { FunctionComponent } from 'react';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { useHistory } from 'react-router-dom';
import { CreateTopicPage } from 'src/Modules/Topics/CreateTopic/CreateTopicPage';

const CreateTopic: FunctionComponent = () => {
  const history = useHistory();

  return (
    <CreateTopicPage
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
