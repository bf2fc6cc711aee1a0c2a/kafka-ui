import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Dropdown,
  DropdownToggle,
  DropdownToggleAction,
  DropdownProps,
  DropdownDirection,
  Divider,
  Menu,
  MenuContent,
  MenuGroup,
  MenuList,
  MenuItem,
} from '@patternfly/react-core';
import {
  createEmptyNewAcl,
  NewAcls,
  AclShortcutType,
} from '@app/modules/Permissions/components/ManagePermissionsDialog/acls';
import {
  AclOperation,
  AclPatternType,
  AclResourceType,
} from '@rhoas/kafka-instance-sdk';

export type PermissionsDropdownProps = Omit<DropdownProps, 'toggle'> & {
  setAcls: React.Dispatch<React.SetStateAction<NewAcls[] | []>>;
};

const PermissionsDropdown: React.VFC<PermissionsDropdownProps> = ({
  setAcls,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  const [isOpen, setIsOpen] = useState<boolean>();
  const [activeItem, setActiveItem] = useState<string | number | undefined>(0);

  const addRow = () => {
    setAcls((prevState) => [...prevState, createEmptyNewAcl()]);
  };

  const onActionClick = () => {
    addRow();
  };

  const onActionToggle = (open: boolean) => {
    setIsOpen(open);
  };

  const addShortcutAclsRow = (itemID: string | number | undefined) => {
    let newState: NewAcls;
    if (itemID === 1) {
      newState = [
        {
          ...createEmptyNewAcl(),
          aclShortcutType: AclShortcutType.ConsumeTopic,
          resourceType: {
            value: AclResourceType.Topic,
          },
          metaData: {
            title: t(
              'permission.manage_permissions_dialog.assign_permissions.shortcut_consume_topic'
            ),
            popoverHeader: t(
              'permission.manage_permissions_dialog.assign_permissions.shortcut_consume_topic'
            ),
            popoverBody: t(
              'permission.manage_permissions_dialog.assign_permissions.shortcut_consume_topic_description'
            ),
            ariaLabel: t(
              'permission.manage_permissions_dialog.assign_permissions.shortcut_consume_topic'
            ),
          },
          operations: [AclOperation.Read, AclOperation.Describe],
        },
        {
          ...createEmptyNewAcl(),
          aclShortcutType: AclShortcutType.ConsumeTopic,
          resourceType: {
            value: AclResourceType.Group,
          },
          operations: [AclOperation.Read],
        },
      ];
    } else if (itemID === 2) {
      newState = {
        ...createEmptyNewAcl(),
        aclShortcutType: AclShortcutType.ProduceTopic,
        resourceType: {
          value: AclResourceType.Topic,
        },
        metaData: {
          title: t(
            'permission.manage_permissions_dialog.assign_permissions.shortcut_produce_topic'
          ),
          popoverHeader: t(
            'permission.manage_permissions_dialog.assign_permissions.shortcut_produce_topic'
          ),
          popoverBody: t(
            'permission.manage_permissions_dialog.assign_permissions.shortcut_produce_topic_description'
          ),
          ariaLabel: t(
            'permission.manage_permissions_dialog.assign_permissions.shortcut_produce_topic'
          ),
        },
        operations: [
          AclOperation.Write,
          AclOperation.Create,
          AclOperation.Describe,
        ],
      };
    } else if (itemID === 3) {
      newState = {
        ...createEmptyNewAcl(),
        aclShortcutType: AclShortcutType.ManageAccess,
        resource: { value: 'kafka-cluster' },
        resourceType: {
          value: AclResourceType.Cluster,
        },
        patternType: { value: AclPatternType.Literal },
        metaData: {
          title: t(
            'permission.manage_permissions_dialog.assign_permissions.shortcut_manage_access'
          ),
          popoverHeader: t(
            'permission.manage_permissions_dialog.assign_permissions.shortcut_manage_access'
          ),
          popoverBody: t(
            'permission.manage_permissions_dialog.assign_permissions.shortcut_manage_access_description'
          ),
          ariaLabel: t(
            'permission.manage_permissions_dialog.assign_permissions.shortcut_manage_access'
          ),
        },
        operations: [AclOperation.Alter],
      };
    }

    setAcls((prevState) => [...prevState, newState]);
  };

  const onSelect = (_, itemId: string | number | undefined) => {
    setActiveItem(itemId);
    setIsOpen((prevState) => !prevState);

    if (itemId === 0) {
      addRow();
    } else {
      addShortcutAclsRow(itemId);
    }
  };

  const dropdownItems = [
    <Menu onSelect={onSelect} activeItemId={activeItem} key='acls-menu'>
      <MenuContent>
        <MenuGroup>
          <MenuList>
            <MenuItem itemId={0}>
              {t(
                'permission.manage_permissions_dialog.assign_permissions.add_permission'
              )}
            </MenuItem>
          </MenuList>
        </MenuGroup>

        <Divider />
        <MenuGroup
          label={t(
            'permission.manage_permissions_dialog.assign_permissions.task_based_permission'
          )}
        >
          <MenuList>
            <MenuItem
              itemId={1}
              description={t(
                'permission.manage_permissions_dialog.assign_permissions.shortcut_consume_topic_description'
              )}
            >
              {t(
                'permission.manage_permissions_dialog.assign_permissions.shortcut_consume_topic'
              )}
            </MenuItem>
            <MenuItem
              itemId={2}
              description={t(
                'permission.manage_permissions_dialog.assign_permissions.shortcut_produce_topic_description'
              )}
            >
              {t(
                'permission.manage_permissions_dialog.assign_permissions.shortcut_produce_topic'
              )}
            </MenuItem>
            <MenuItem
              itemId={3}
              description={t(
                'permission.manage_permissions_dialog.assign_permissions.shortcut_manage_access_description'
              )}
            >
              {t(
                'permission.manage_permissions_dialog.assign_permissions.shortcut_manage_access'
              )}
            </MenuItem>
          </MenuList>
        </MenuGroup>
      </MenuContent>
    </Menu>,
  ];

  return (
    <Dropdown
      id='permissions-dropdown'
      direction={DropdownDirection.up}
      toggle={
        <DropdownToggle
          id='permission-dropdown-toggle'
          splitButtonItems={[
            <DropdownToggleAction key='add-permission' onClick={onActionClick}>
              {t(
                'permission.manage_permissions_dialog.assign_permissions.add_permission'
              )}
            </DropdownToggleAction>,
          ]}
          splitButtonVariant='action'
          onToggle={onActionToggle}
        />
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
      isGrouped
    />
  );
};

export { PermissionsDropdown };
