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
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';

export const Schemas: React.FC = () => {
  const { t } = useTranslation();

  const [selectedSchema, setSelectedSchema] = useState<boolean>(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState<boolean>(false);

  const onToggleSchema = (isSchemaOpen: boolean) => {
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
        <GridItem>
          <Card>
            <CardTitle component='h2'>
              {t('schema.service_registry_instance')}
            </CardTitle>
            <CardBody>
              <Grid hasGutter rowSpan={2}>
                <GridItem>
                  <Select
                    variant={SelectVariant.typeahead}
                    typeAheadAriaLabel={t('schema.select_instance')}
                    placeholderText={t('schema.select_instance')}
                    onToggle={onToggleSchema}
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
                </GridItem>
                <GridItem>
                  <Button
                    isInline
                    variant={ButtonVariant.link}
                    component='a'
                    href='#'
                  >
                    {t('schema.schema_helper_text')}
                  </Button>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardTitle component='h2'>{t('schema.topic_schemas')}</CardTitle>
            <CardBody>
              <DescriptionList
                className={'pf-c-description-list__RowGap'}
                isHorizontal
                isAutoColumnWidths
                columnModifier={{ lg: '2Col' }}
              >
                <DescriptionListTerm>
                  {t('schema.schema_value_description_title')}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <Grid hasGutter rowSpan={2}>
                    <GridItem rowSpan={2}>
                      <CheckCircleIcon /> {'topic-test-value'}
                    </GridItem>
                    <GridItem>
                      <Button
                        isInline
                        variant={ButtonVariant.link}
                        component='a'
                        href='#'
                      >
                        {t('schema.view_details')} <ExternalLinkAltIcon />
                      </Button>
                    </GridItem>
                  </Grid>
                </DescriptionListDescription>
                <DescriptionListTerm>
                  {t('schema.key_value_description_title')}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <Grid hasGutter span={2}>
                    <GridItem>
                      <Alert
                        className='pf-c-alert pf-m-info pf-m-plain pf-m-inline'
                        variant={AlertVariant.info}
                        title='No matching schema'
                      />
                    </GridItem>
                    <GridItem>
                      <ConsumerGroupPopover
                        title={t('schema.schema_key_popover_title')}
                        description={t('schema.schema_popover_description')}
                      />
                    </GridItem>
                  </Grid>
                </DescriptionListDescription>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
};
