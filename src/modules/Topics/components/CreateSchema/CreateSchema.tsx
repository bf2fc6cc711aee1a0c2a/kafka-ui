import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridItem,
  Card,
  CardTitle,
  CardBody,
  Select,
  SelectOption,
  SelectVariant,
  Button,
  ButtonVariant,
  Alert,
  AlertVariant,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListDescription,
  PageSection,
} from '@patternfly/react-core';
import { ConsumerGroupPopover } from '@app/modules/ConsumerGroups/components/ConsumerGroupsPopover';
import './style.css';
import { CheckCircleIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

export const CreateSchema: React.FC = () => {
  const { t } = useTranslation();

  const [selectedSchema, setSelectedSchema] = useState<boolean>(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState<boolean>(false);

  const onSchemaToggle = (isSchemaOpen) => {
    setIsSchemaOpen(isSchemaOpen);
  };

  const onSchemaSelect = (_, selection) => {
    setSelectedSchema(selection);
    setIsSchemaOpen(false);
  };

  const onClearSchema = () => {
    setSelectedSchema(false);
  };

  return (
    <PageSection>
      <Grid hasGutter>
        <Card>
          <CardTitle component='h2'>{'Service Registry instance'}</CardTitle>
          <CardBody>
            <Grid hasGutter rowSpan={2}>
              <Select
                variant={SelectVariant.typeahead}
                typeAheadAriaLabel='Select instance'
                placeholderText='Select instance'
                onToggle={onSchemaToggle}
                onSelect={onSchemaSelect}
                selections={selectedSchema}
                isOpen={isSchemaOpen}
                width={600}
                onClear={onClearSchema}
              >
                <SelectOption key={0} value='test-instance' />
                <SelectOption key={1} value='test-instance1' />
                <SelectOption key={2} value='test-instance2' />
              </Select>
              <Button
                isInline
                variant={ButtonVariant.link}
                component='a'
                href='#'
              >
                {t('topic.schema_helper_text')}
              </Button>
            </Grid>
          </CardBody>
        </Card>
        <Card>
          <CardTitle component='h2'>{'Topic schemas'}</CardTitle>
          <CardBody>
            <DescriptionList
              className={'pf-c-description-list__RowGap'}
              isHorizontal
              isAutoColumnWidths
              columnModifier={{ lg: '2Col' }}
            >
              <DescriptionListTerm>
                {t('topic.schema_value_description_title')}
              </DescriptionListTerm>
              <DescriptionListDescription>
                <Grid hasGutter rowSpan={2}>
                  <GridItem>
                    <CheckCircleIcon /> topic-test-value
                  </GridItem>
                  <GridItem>
                    <Button
                      isInline
                      variant={ButtonVariant.link}
                      component='a'
                      href='#'
                    >
                      View-details <ExternalLinkAltIcon />
                    </Button>
                  </GridItem>
                </Grid>
              </DescriptionListDescription>
              <DescriptionListTerm>
                {t('topic.key_value_description_title')}
              </DescriptionListTerm>
              <DescriptionListDescription>
                <Grid hasGutter span={2}>
                  <Alert
                    className='pf-c-alert pf-m-info pf-m-plain pf-m-inline'
                    variant={AlertVariant.info}
                    title='No matching schema'
                  />
                  <ConsumerGroupPopover
                    title={t('topic.schema_key_popover_title')}
                    description={t('topic.schema_popover_description')}
                  />
                </Grid>
              </DescriptionListDescription>
            </DescriptionList>
          </CardBody>
        </Card>
      </Grid>
    </PageSection>
  );
};
