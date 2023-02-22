import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertVariant,
  useAlert,
  useBasename,
} from '@rhoas/app-services-ui-shared';
import { ConfigContext, useFederated } from '@app/contexts';
import { getTopic } from '@app/services';
import { CreateTopicPage, NewTopic } from '@rhoas/app-services-ui-components';
import { NewTopicInput } from '@rhoas/kafka-instance-sdk';
import {
  constantValues,
  formatTopic,
  initialValues,
  saveTopicData,
} from './utils';

type CreateTopicProps = {
  partitionsLimit?: () => Promise<number | undefined>;
};

export const CreateTopic: React.FC<CreateTopicProps> = () => {
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { kafkaName, kafkaPageLink, kafkaInstanceLink } = useFederated() || {};
  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();
  const {
    replicationFactor = 0,
    minInSyncReplicas = 0,
    isMultiAZ,
  } = useFederated() || {};

  const config = useContext(ConfigContext);

  const onCloseCreateTopic = () => {
    history.push(`${basename}/topics`);
  };
  const saveTopic = (topicData: NewTopic) => {
    const topic: NewTopicInput = formatTopic(topicData, isSwitchChecked);
    saveTopicData(config?.basePath, config?.getToken, topic)
      .then(() => {
        addAlert({
          variant: AlertVariant.success,
          title: t('topic.topic_successfully_created'),
        });
        onCloseCreateTopic();
      })
      .catch((err) => {
        addAlert({
          variant: AlertVariant.danger,
          title: err.response.data.error_message,
        });
        onCloseCreateTopic();
      });
  };
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };

  const initialTopicValues: NewTopic = initialValues(
    isSwitchChecked,
    replicationFactor,
    minInSyncReplicas,
    isMultiAZ
  );

  const fetchTopic = async (topicName: string) => {
    try {
      const topicRes = await getTopic(topicName, config);
      if (topicRes) {
        return false;
      } else return true;
    } catch (error) {
      return true;
    }
  };

  return (
    <CreateTopicPage
      kafkaName={kafkaName || ''}
      kafkaPageLink={kafkaPageLink || ''}
      kafkaInstanceLink={kafkaInstanceLink || ''}
      onSave={saveTopic}
      initialTopicValues={initialTopicValues}
      onCloseCreateTopic={onCloseCreateTopic}
      checkTopicName={fetchTopic}
      availablePartitionLimit={100}
      constantValues={constantValues}
      isSwitchChecked={isSwitchChecked}
      setIsSwitchChecked={setIsSwitchChecked}
    />
  );
};
