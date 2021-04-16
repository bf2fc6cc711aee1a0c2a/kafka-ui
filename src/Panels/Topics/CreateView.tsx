import React, { FunctionComponent } from 'react';
import './style.scss';
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
