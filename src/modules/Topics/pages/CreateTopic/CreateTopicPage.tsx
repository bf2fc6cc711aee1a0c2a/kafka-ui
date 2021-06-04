import React, { useState } from "react";
import {
  CreateTopichead,
  CreateTopicWizard,
} from "@app/modules/Topics/components";
import { useFederated } from "@app/contexts";
import "../style.css";

export type CreateTopicPageProps = {
  onCloseCreateTopic: () => void;
};

export const CreateTopicPage: React.FC<CreateTopicPageProps> = ({
  onCloseCreateTopic,
}) => {
  const { kafkaName, kafkaPageLink, kafkaInstanceLink } = useFederated();
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
        onCloseCreateTopic={onCloseCreateTopic}
      />
    </>
  );
};
