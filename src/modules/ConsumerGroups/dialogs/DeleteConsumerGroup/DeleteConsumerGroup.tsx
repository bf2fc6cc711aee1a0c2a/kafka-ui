import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalVariant,
  Button,
  Text,
  AlertVariant,
  TextInput,
} from "@patternfly/react-core";
import { deleteConsumerGroup } from "@app/services";
import { ConfigContext, AlertContext } from "@app/contexts";
import { useRootModalContext } from "@app/components/RootModal";

export const DeleteConsumerGroup: React.FC = () => {
  const { t } = useTranslation();
  const { store, hideModal } = useRootModalContext();
  const { consumerName, refreshConsumerGroups } = store?.modalProps || {};
  const [verificationText, setVerificationText] = useState<string>("");
  const { addAlert } = useContext(AlertContext);

  const onClose = () => {
    hideModal();
  };

  const onDelete = async () => {
    try {
      consumerName && (await deleteConsumerGroup(consumerName, config));
      addAlert(
        t("consumerGroup.consumergroup_successfully_deleted", {
          name: consumerName,
        }),
        AlertVariant.success
      );
      refreshConsumerGroups && refreshConsumerGroups();
    } catch (err) {
      addAlert(err.response.data.error_message, AlertVariant.danger);
    }
    onClose();
  };

  const config = useContext(ConfigContext);

  const handleVerificationTextChange = (value) => {
    setVerificationText(value);
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={true}
      aria-label={t("consumerGroup.delete")}
      title={t("consumerGroup.delete")}
      titleIconVariant="warning"
      showClose={true}
      aria-describedby="modal-message"
      onClose={onClose}
      actions={[
        <Button
          variant="danger"
          onClick={onDelete}
          key={1}
          isDisabled={verificationText.toUpperCase() != "DELETE"}
        >
          {t("common.delete")}
        </Button>,
        <Button variant="link" onClick={onClose} key={2}>
          {t("common.cancel")}
        </Button>,
      ]}
    >
      <Text id="modal-message">
        <label
          htmlFor="instance-name-input"
          dangerouslySetInnerHTML={{
            __html: t("common.confirm_delete_modal_text", {
              name: consumerName,
            }),
          }}
        />
      </Text>

      <br />
      <label htmlFor="delete-text-input">{t("common.confirm_delete")}</label>
      <TextInput
        value={verificationText}
        id="delete-text-input"
        name="delete-text-input"
        type="text"
        onChange={handleVerificationTextChange}
        autoFocus={true}
      />
    </Modal>
  );
};
