import React from 'react';
import { cellWidth, ICell } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import {
  ActionList,
  ActionListItem,
  Button,
  Text,
  TextContent,
  TextVariants,
  Popover,
  ButtonVariant,
} from '@patternfly/react-core';

import { NewAcls } from '@app/modules/Permissions/components/ManagePermissionsDialog/acls';
import { PermissionsDropdown } from './PermissionsDropdown';
import { AclShortcutType } from './acls';
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import { OperationCell } from './OperationCell';
import { PermissionTypeCell } from './PermissionTypeCell';
import { ResourceType } from './ResourceType';
import { PatternTypeCell } from './PatternTypeCell';
import { ResourceCell } from './ResourceCell';
import { RemoveButtonCell } from './RemoveButtonCell';

export type CreatePermissionsProps = {
  selectedAccount?: string;
  topicNames: string[];
  consumerGroupIds: string[];
  acls: NewAcls[] | undefined;
  setAcls: React.Dispatch<React.SetStateAction<NewAcls[] | []>>;
  setEscapeClosesModal: (closes: boolean) => void;
  resourceOperations: { [key: string]: Array<string> };
  menuAppendTo:
    | HTMLElement
    | (() => HTMLElement)
    | 'parent'
    | 'inline'
    | undefined;
  kafkaName: string | undefined;
};

export const CreatePermissions: React.FunctionComponent<CreatePermissionsProps> =
  ({
    acls,
    setAcls,
    topicNames,
    consumerGroupIds,
    selectedAccount,
    setEscapeClosesModal,
    resourceOperations,
    menuAppendTo,
    kafkaName,
  }) => {
    const { t } = useTranslation(['kafkaTemporaryFixMe']);

    const tableColumns = [
      {
        title: t('permission.table.resource_column_title'),
        columnTransforms: [cellWidth(20)],
      },
      {
        title: '',
        columnTransforms: [cellWidth(20)],
      },
      {
        title: '',
        columnTransforms: [cellWidth(20)],
      },
      {
        title: t('permission.table.permissions_column_title'),
        columnTransforms: [cellWidth(15)],
      },
      {
        title: '',
        columnTransforms: [cellWidth(15)],
      },
      {
        title: '',
        columnTransforms: [cellWidth(10)],
      },
    ] as ICell[];

    const removeRow = (row: number) => {
      setAcls((prevState) => {
        return prevState.filter((v, k) => k !== row);
      });
    };

    const formGroupHelperText = () => {
      if (selectedAccount === '*') {
        return t(
          'permission.manage_permissions_dialog.assign_permissions.help_all_accounts'
        );
      }
      return t('permission.manage_permissions_dialog.assign_permissions.help', {
        account_id: selectedAccount,
      });
    };

    const preparedRows = (acl: NewAcls, row: number) => {
      const newAcl = Array.isArray(acl) ? acl : [acl];
      return newAcl.map((acl, childRow) => {
        return (
          <>
            {acl.aclShortcutType && childRow === 0 && (
              <Tr style={{ borderBottom: 'none' }}>
                <Td colSpan={5}>
                  <TextContent>
                    <Text component={TextVariants.h6}>
                      {acl?.metaData?.title}
                      <Popover
                        headerContent={<div>{acl.metaData?.popoverHeader}</div>}
                        bodyContent={<div>{acl.metaData?.popoverBody}</div>}
                      >
                        <Button
                          variant={ButtonVariant.plain}
                          aria-label={acl.metaData?.ariaLabel}
                        >
                          <HelpIcon />
                        </Button>
                      </Popover>
                    </Text>
                  </TextContent>
                </Td>
                <Td>
                  <RemoveButtonCell acl={acl} row={row} removeRow={removeRow} />
                </Td>
              </Tr>
            )}
            <Tr
              key={row}
              style={{
                borderBottom: newAcl.length > 1 && childRow === 0 ? 'none' : '',
              }}
            >
              <Td
                width={
                  acl.aclShortcutType === AclShortcutType.ManageAccess ? 50 : 20
                }
                colSpan={
                  acl.aclShortcutType === AclShortcutType.ManageAccess ? 3 : 0
                }
                noPadding
              >
                <ResourceType
                  row={row}
                  acl={acl}
                  childRow={childRow}
                  setAcls={setAcls}
                  menuAppendTo={menuAppendTo}
                  setEscapeClosesModal={setEscapeClosesModal}
                  kafkaName={kafkaName}
                />
              </Td>
              {acl.aclShortcutType !== AclShortcutType.ManageAccess && (
                <>
                  <Td width={15} noPadding>
                    <PatternTypeCell
                      row={row}
                      acl={acl}
                      childRow={childRow}
                      setAcls={setAcls}
                      menuAppendTo={menuAppendTo}
                      setEscapeClosesModal={setEscapeClosesModal}
                    />
                  </Td>
                  <Td width={25} noPadding>
                    <ResourceCell
                      acl={acl}
                      row={row}
                      childRow={childRow}
                      setAcls={setAcls}
                      menuAppendTo={menuAppendTo}
                      setEscapeClosesModal={setEscapeClosesModal}
                      topicNames={topicNames}
                      consumerGroupIds={consumerGroupIds}
                    />
                  </Td>
                </>
              )}
              <Td
                width={acl.aclShortcutType ? 40 : 15}
                colSpan={acl.aclShortcutType ? 3 : 0}
                noPadding
              >
                <PermissionTypeCell
                  acl={acl}
                  row={row}
                  childRow={childRow}
                  setAcls={setAcls}
                  menuAppendTo={menuAppendTo}
                  setEscapeClosesModal={setEscapeClosesModal}
                />
              </Td>
              {!acl.aclShortcutType && (
                <>
                  <Td width={15} noPadding>
                    <OperationCell
                      acl={acl}
                      row={row}
                      childRow={childRow}
                      setAcls={setAcls}
                      menuAppendTo={menuAppendTo}
                      setEscapeClosesModal={setEscapeClosesModal}
                      resourceOperations={resourceOperations}
                    />
                  </Td>
                  <Td width={10}>
                    <RemoveButtonCell
                      acl={acl}
                      row={row}
                      removeRow={removeRow}
                    />
                  </Td>
                </>
              )}
            </Tr>
          </>
        );
      });
    };

    return (
      <div>
        <TextContent>
          <Text component={TextVariants.h2}>
            {t('permission.manage_permissions_dialog.assign_permissions.title')}
          </Text>
          <Text component={TextVariants.small}>{formGroupHelperText()}</Text>
          {acls && acls.length > 0 && (
            <Text component={TextVariants.small}>
              {t(
                'permission.manage_permissions_dialog.assign_permissions.all_fields_are_required'
              )}
            </Text>
          )}
        </TextContent>
        {acls && acls.length > 0 && (
          <TableComposable
            aria-label='Assign permission table'
            variant='compact'
          >
            <Thead noWrap>
              <Tr>
                {tableColumns?.map((col, index) => (
                  <Th key={index}>{col.title}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>{acls?.map((acl, row) => preparedRows(acl, row))}</Tbody>
          </TableComposable>
        )}
        <ActionList>
          <ActionListItem style={{ marginLeft: '20px', marginTop: '15px' }}>
            <PermissionsDropdown setAcls={setAcls} />
          </ActionListItem>
        </ActionList>
      </div>
    );
  };
