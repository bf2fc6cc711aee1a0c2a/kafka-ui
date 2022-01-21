import React, { useState } from 'react';
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

const PermissionsDropdown: React.FC<PermissionsDropdownProps> = ({
  setAcls,
}) => {
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
            title: 'Consume from a topic',
            popoverHeader: 'Consume from a topic',
            popoverBody:
              'Provides access to consume from one or more topics depending on topic and consumer group selection criteria',
            ariaLabel: 'Consume from a topic',
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
          title: 'Produce to a topic',
          popoverHeader: 'Produce to a topic',
          popoverBody:
            'Provides access to produce to one or more topics depending on topic selection criteria',
          ariaLabel: 'Produce to a topic',
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
          title: 'Manage access',
          popoverHeader: 'Manage access',
          popoverBody:
            'Provides access to add and remove permissions on this Kafka instance',
          ariaLabel: 'Manage access',
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
            <MenuItem itemId={0}>Add permission</MenuItem>
          </MenuList>
        </MenuGroup>
        <Divider />
        <MenuGroup label='Task-based permissions'>
          <MenuList>
            <MenuItem
              itemId={1}
              description='Provides access to consume from one or more topics depending on topic and consumer group selection criteria'
            >
              Consume from topic
            </MenuItem>
            <MenuItem
              itemId={2}
              description='Provides access to produce to one or more topics depending on topic selection criteria'
            >
              Produce to a topic
            </MenuItem>
            <MenuItem
              itemId={3}
              description='Provides access to add and remove permissions on this Kafka instance'
            >
              Manage access
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
              Add permission
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
