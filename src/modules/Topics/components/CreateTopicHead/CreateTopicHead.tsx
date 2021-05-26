import React from "react";
import { useTranslation } from "react-i18next";
import {
  PageSection,
  PageSectionVariants,
  Title,
  Switch,
  Breadcrumb,
  BreadcrumbItem,
} from "@patternfly/react-core";

export type ICreateTopicProps = {
  isSwitchChecked: boolean;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  setIsSwitchChecked: (value: boolean) => void;
};

export const CreateTopichead: React.FC<ICreateTopicProps> = ({
  isSwitchChecked,
  setIsSwitchChecked,
  kafkaName,
  kafkaPageLink,
}) => {
  const { t } = useTranslation();

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to={kafkaPageLink ? kafkaPageLink : "#"}>
        Kafka Instances
      </BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>
        {kafkaName ? kafkaName : t("common.kafka_instance_name")}
      </BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>
        {t("topic.create_topic")}
      </BreadcrumbItem>
    </Breadcrumb>
  );
  return (
    <>
      <section className="pf-c-page__main-breadcrumb">
        {mainBreadcrumbs}
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1" size="2xl">
          {t("topic.create_topic")}
        </Title>
        <br />
        <Switch
          id="simple-switch"
          label={t("topic.show_all_options")}
          labelOff={t("topic.show_all_options")}
          isChecked={isSwitchChecked}
          onChange={setIsSwitchChecked}
          className="create-topic-wizard"
        />
      </PageSection>
    </>
  );
};
