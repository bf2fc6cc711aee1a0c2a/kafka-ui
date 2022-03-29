import React, { useState } from 'react';
import {
  Drawer,
  DrawerProps,
  DrawerContent,
  DrawerPanelContent,
  DrawerHead,
  DrawerPanelBody,
  DrawerActions,
  DrawerCloseButton,
  TextContent,
  Text,
  TextVariants,
  Title,
  TitleSizes,
  DrawerPanelContentProps,
  TextProps,
  TitleProps,
  DrawerContentBody,
  Dropdown,
  KebabToggle,
  DropdownPosition,
  DropdownItem,
} from '@patternfly/react-core';
import { MASLoading } from '@app/components';
import './MASDrawer.css';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import { useTranslation } from 'react-i18next';
import {
  ModalType,
  ModalTypePropsMap,
  useModal,
} from '@rhoas/app-services-ui-shared';

export type MASDrawerProps = DrawerProps & {
  children: React.ReactNode;
  panelBodyContent?: React.ReactNode;
  onClose: () => void;
  isLoading?: boolean;
  drawerPanelContentProps?: Omit<DrawerPanelContentProps, 'children'>;
  drawerHeaderProps?: {
    text?: Omit<TextProps, 'children' | 'ref'> & {
      label: string | undefined;
    };
    title?: Omit<TitleProps, 'children'> & {
      value: string | undefined;
    };
  };
  ['data-ouia-app-id']?: string;
  notRequiredDrawerContentBackground?: boolean | undefined;
  inlineAlertMessage?: React.ReactNode;
  refreshConsumerGroups?: () => void;
  consumerGroupDetail: ConsumerGroup | undefined;
};

export const MASDrawer: React.FC<MASDrawerProps> = ({
  onClose,
  isLoading = false,
  drawerPanelContentProps,
  drawerHeaderProps,
  isExpanded,
  children,
  panelBodyContent,
  onExpand,
  notRequiredDrawerContentBackground,
  'data-ouia-app-id': dataOuiaAppId,
  inlineAlertMessage,
  refreshConsumerGroups,
  consumerGroupDetail,
}: MASDrawerProps) => {
  const { widths, ...restDrawerPanelContentProps } =
    drawerPanelContentProps || {};
  const { text, title } = drawerHeaderProps || {};
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { showModal } = useModal<ModalType.KafkaDeleteConsumerGroup>();
  const { showModal: showResetOffsetModal } =
    useModal<ModalType.KafkaConsumerGroupResetOffset>();
  const [isOpen, setIsOpen] = useState<boolean>();

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const onSelectDeleteConsumerGroup = () => {
    showModal(ModalType.KafkaDeleteConsumerGroup, {
      consumerName: title?.value || '',
      refreshConsumerGroups,
    });
    onClose();
  };
  const onSelectResetOffsetConsumerGroup = () => {
    showResetOffsetModal(ModalType.KafkaConsumerGroupResetOffset, {
      refreshConsumerGroups,
      consumerGroupData:
        consumerGroupDetail as ModalTypePropsMap[ModalType.KafkaConsumerGroupResetOffset]['consumerGroupData'],
    });
  };

  const dropdownItems = [
    <DropdownItem key='reset offset' onClick={onSelectResetOffsetConsumerGroup}>
      {t('consumerGroup.reset_offset')}
    </DropdownItem>,
    <DropdownItem key='delete' onClick={onSelectDeleteConsumerGroup}>
      {t('common.delete')}
    </DropdownItem>,
  ];

  const panelContent = (
    <DrawerPanelContent
      widths={widths || { default: 'width_50' }}
      {...restDrawerPanelContentProps}
    >
      {isLoading ? (
        <MASLoading />
      ) : (
        <>
          <DrawerHead>
            <TextContent>
              {text?.label && (
                <Text
                  component={text?.component || TextVariants.small}
                  className={
                    text?.className || 'kafka-ui-mas-drawer__top-label'
                  }
                >
                  {text?.label}
                </Text>
              )}
              {title?.value && (
                <Title
                  headingLevel={title?.headingLevel || 'h2'}
                  size={title?.size || TitleSizes['xl']}
                  className={title?.className || 'kafka-ui-mas-drawer__title'}
                >
                  {title?.value}
                </Title>
              )}
            </TextContent>
            <DrawerActions>
              <Dropdown
                onSelect={onSelect}
                toggle={
                  <KebabToggle onToggle={onToggle} id='toggle-data-plane' />
                }
                isOpen={isOpen}
                isPlain
                dropdownItems={dropdownItems}
                position={DropdownPosition.right}
              >
                {<EllipsisVIcon />}
              </Dropdown>
              <DrawerCloseButton onClick={onClose} />
            </DrawerActions>
          </DrawerHead>
          <DrawerPanelBody>
            {inlineAlertMessage}
            {panelBodyContent}
          </DrawerPanelBody>
        </>
      )}
    </DrawerPanelContent>
  );

  return (
    <Drawer
      isExpanded={isExpanded}
      onExpand={onExpand}
      data-ouia-app-id={dataOuiaAppId}
    >
      <DrawerContent
        panelContent={panelContent}
        className={
          notRequiredDrawerContentBackground ? 'pf-m-no-background' : ''
        }
      >
        <DrawerContentBody className='kafka-ui-mas-drawer__drawer-content-body'>
          {children}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};
