import {
  AclOperation,
  AclPatternType,
  AclPermissionType,
  AclResourceType,
} from '@rhoas/kafka-instance-sdk';
import React from 'react';
import {
  getOperations,
  getPatternTypes,
  getPermissionsTypes,
  getResourceTypes,
} from '@app/services/acls';
import { cellWidth, ICell } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import {
  ActionList,
  ActionListItem,
  Button,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
  ValidatedOptions,
  LabelGroup,
  Label,
  Popover,
  ButtonVariant,
} from '@patternfly/react-core';
import { CreateSelect } from '@app/modules/Permissions/components/ManagePermissionsDialog/CreateSelect';
import { sentenceCase } from 'sentence-case';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';
import { snakeCase } from 'snake-case';
import { CreateTypeahead } from '@app/modules/Permissions/components/ManagePermissionsDialog/CreateTypeahead';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';
import {
  createEmptyNewAcl,
  NewAcl,
  NewAcls,
} from '@app/modules/Permissions/components/ManagePermissionsDialog/acls';
import { displayName } from '@app/modules/Permissions/utils';
import { useValidateTopic } from '@app/modules/Topics/utils';
import { PermissionsDropdown } from './PermissionsDropdown';
import { AclShortcutType } from './acls';
import { SolidLabel } from './SolidLabel';
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';

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
    const { validateName } = useValidateTopic();
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

    const setPermissionType = (
      row: number,
      value?: AclPermissionType,
      childRow?: number
    ) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            if (Array.isArray(v) && childRow !== undefined)
              v[childRow].permission = { value };
            else v.permission = { value };
          }
          return v;
        })
      );
    };

    const setOperation = (
      row: number,
      value?: AclOperation,
      childRow?: number
    ) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            if (Array.isArray(v) && childRow !== undefined)
              v[childRow].operation = { value };
            else v.operation = { value };
          }
          return v;
        })
      );
    };

    const setResourceType = (
      row: number,
      value?: AclResourceType,
      childRow?: number
    ) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            if (Array.isArray(v) && childRow !== undefined)
              v[row][childRow].resourceType = { value };
            else v.resourceType = { value };
          }
          return v;
        })
      );
    };

    const setPatternType = (
      row: number,
      value?: AclPatternType,
      childRow?: number
    ) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            if (Array.isArray(v) && childRow !== undefined) {
              v[childRow].patternType = { value };
            } else {
              v.patternType = { value };
            }
          }
          return v;
        })
      );
    };

    const setResource = (row: number, value?: string, childRow?: number) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            if (Array.isArray(v) && childRow !== undefined)
              v[childRow].resource = { value };
            else v.resource = { value };
          }
          return v;
        })
      );
    };

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

    type CellProps = {
      acl: NewAcl;
      row: number;
      childRow?: number;
    };

    const PatternTypeCell: React.FunctionComponent<CellProps> = ({
      acl,
      row,
      childRow = 0,
    }) => {
      if (
        acl.resourceType.value === AclResourceType.Cluster ||
        acl.aclShortcutType === AclShortcutType.ManageAccess
      ) {
        return <></>;
      }

      return (
        <CreateSelect
          options={getPatternTypes()
            ?.map((value) => {
              return {
                value,
                title:
                  value === AclPatternType.Prefixed
                    ? t(
                        'permission.manage_permissions_dialog.assign_permissions.pattern_type_prefixed'
                      )
                    : t(
                        'permission.manage_permissions_dialog.assign_permissions.pattern_type_literal'
                      ),
                description:
                  value === AclPatternType.Prefixed
                    ? t(
                        'permission.manage_permissions_dialog.assign_permissions.pattern_type_prefixed_help'
                      )
                    : t(
                        'permission.manage_permissions_dialog.assign_permissions.pattern_type_literal_help'
                      ),
              } as SelectOption<AclPatternType>;
            })
            .sort((a, b) => b.value.localeCompare(a.value))}
          selected={acl.patternType}
          setSelected={setPatternType}
          row={row}
          childRow={childRow}
          id='pattern-type'
          setEscapeClosesModal={setEscapeClosesModal}
          menuAppendTo={menuAppendTo}
          onClear={() => createEmptyNewAcl().patternType.value}
          onSelect={(value) => {
            setAcls((prevState) => {
              const newPrevState = handle2DArrayAcls(prevState, row, childRow);
              if (value === undefined) {
                newPrevState.patternType.validated = ValidatedOptions.error;
                newPrevState.patternType.validated = t(
                  'permission.manage_permissions_dialog.assign_permissions.must_select_pattern_type_error'
                );
              } else {
                newPrevState.patternType.validated = ValidatedOptions.default;
              }

              return update2DArrayAcls(prevState, newPrevState, row, childRow);
            });
          }}
        />
      );
    };

    const ResourceType: React.FunctionComponent<CellProps> = ({
      row,
      acl,
      childRow = 0,
    }) => {
      const { resourceType } = acl;
      if (
        (acl.aclShortcutType === AclShortcutType.ConsumeTopic ||
          acl.aclShortcutType === AclShortcutType.ProduceTopic) &&
        resourceType?.value
      ) {
        return (
          <>
            <SolidLabel variant={resourceType.value} />{' '}
            {displayName(resourceType.value)}
          </>
        );
      } else if (acl.aclShortcutType === AclShortcutType.ManageAccess) {
        return (
          <>
            <SolidLabel variant={AclResourceType.Cluster} />{' '}
            {displayName(AclResourceType.Cluster)} is "{kafkaName}"
          </>
        );
      }

      return (
        <CreateSelect
          options={getResourceTypes().map((value) => {
            return {
              value,
              title: displayName(value),
            } as SelectOption<AclResourceType>;
          })}
          selected={acl.resourceType}
          setSelected={setResourceType}
          row={row}
          id='resource-type'
          placeholder={t(
            'permission.manage_permissions_dialog.assign_permissions.resource_type_placeholder'
          )}
          setEscapeClosesModal={setEscapeClosesModal}
          menuAppendTo={menuAppendTo}
          onClear={() => createEmptyNewAcl().resourceType.value}
          onSelect={(value) => {
            setAcls((prevState) => {
              const newPrevState = handle2DArrayAcls(prevState, row, childRow);
              if (value === undefined) {
                newPrevState.validated = ValidatedOptions.error;
                newPrevState.errorMessage = t(
                  'permission.manage_permissions_dialog.assign_permissions.must_select_resource_type_error'
                );
              } else {
                newPrevState.validated = ValidatedOptions.default;
              }
              return update2DArrayAcls(prevState, newPrevState, row, childRow);
            });
          }}
        />
      );
    };

    const update2DArrayAcls = (
      prevAcls: NewAcls[],
      newAcl: NewAcl,
      row: number,
      childRow = 0
    ) => {
      if (Array.isArray(prevAcls[row]) && childRow !== undefined)
        prevAcls[row][childRow] = newAcl;
      else prevAcls[row] = newAcl;
      return prevAcls;
    };

    const handle2DArrayAcls = (acls: NewAcls[], row: number, childRow = 0) => {
      const newAcls = Array.isArray(acls[row])
        ? acls[row][childRow]
        : acls[row];
      return newAcls;
    };

    const ResourceCell: React.FunctionComponent<CellProps> = ({
      row,
      acl,
      childRow = 0,
    }) => {
      if (
        acl.resourceType.value === AclResourceType.Cluster ||
        acl.aclShortcutType === AclShortcutType.ManageAccess
      ) {
        return <></>;
      }
      return (
        <CreateTypeahead
          row={row}
          childRow={childRow}
          value={acl.resource}
          setValue={setResource}
          id='resource'
          placeholder={t(
            `permission.manage_permissions_dialog.assign_permissions.pattern_type_${
              acl.patternType.value?.toLowerCase() || 'prefixed'
            }_placeholder`
          )}
          setEscapeClosesModal={setEscapeClosesModal}
          menuAppendTo={menuAppendTo}
          initialOptions={() => {
            if (acl.resourceType.value === AclResourceType.Topic) {
              return topicNames;
            }
            if (acl.resourceType.value === AclResourceType.Group) {
              return consumerGroupIds;
            }
            return [];
          }}
          onSelect={(value) => {
            if (value === '*') {
              setAcls((prevState) => {
                const newPrevState = handle2DArrayAcls(
                  prevState,
                  row,
                  childRow
                );
                newPrevState.resource.validated = ValidatedOptions.default;
                return update2DArrayAcls(
                  prevState,
                  newPrevState,
                  row,
                  childRow
                );
              });
            } else {
              const errorMessage = validateName(value);
              if (errorMessage !== undefined) {
                setAcls((prevState) => {
                  const newPrevState = handle2DArrayAcls(
                    prevState,
                    row,
                    childRow
                  );
                  newPrevState.validated = ValidatedOptions.error;
                  newPrevState.errorMessage = errorMessage;
                  return update2DArrayAcls(
                    prevState,
                    newPrevState,
                    row,
                    childRow
                  );
                });
              } else if (value !== undefined) {
                setAcls((prevState) => {
                  const newPrevState = handle2DArrayAcls(
                    prevState,
                    row,
                    childRow
                  );
                  newPrevState.validated = ValidatedOptions.default;
                  return update2DArrayAcls(
                    prevState,
                    newPrevState,
                    row,
                    childRow
                  );
                });
              }
            }
          }}
        />
      );
    };

    const PermissionTypeCell: React.FunctionComponent<CellProps> = ({
      acl,
      row,
      childRow = 0,
    }) => {
      if (acl.aclShortcutType) {
        return (
          <>
            {Array.isArray(acl?.operations) && (
              <LabelGroup numLabels={4}>
                <Label
                  variant='outline'
                  color={
                    acl.permission.value === AclPermissionType.Deny
                      ? 'red'
                      : undefined
                  }
                >
                  {sentenceCase(acl.permission.value || '')}
                </Label>
                {acl?.operations?.map((operation) => (
                  <Label variant='outline' key={operation}>
                    {sentenceCase(operation)}
                  </Label>
                ))}
              </LabelGroup>
            )}
          </>
        );
      }

      return (
        <CreateSelect
          options={getPermissionsTypes().map((value) => {
            return {
              value,
              title: sentenceCase(value),
            } as SelectOption<AclPermissionType>;
          })}
          selected={acl.permission}
          setSelected={setPermissionType}
          row={row}
          id='permission-type'
          setEscapeClosesModal={setEscapeClosesModal}
          menuAppendTo={menuAppendTo}
          onClear={() => createEmptyNewAcl().permission.value}
          onSelect={(value) => {
            setAcls((prevState) => {
              const newPrevState = handle2DArrayAcls(prevState, row, childRow);
              if (value === undefined) {
                newPrevState.permission.validated = ValidatedOptions.error;
                newPrevState.permission.errorMessage = t(
                  'permission.manage_permissions_dialog.assign_permissions.must_select_permission_error'
                );
              } else {
                newPrevState.permission.validated = ValidatedOptions.default;
              }
              return update2DArrayAcls(prevState, newPrevState, row, childRow);
            });
          }}
        />
      );
    };

    const OperationCell: React.FunctionComponent<CellProps> = ({
      acl,
      row,
      childRow = 0,
    }) => {
      return (
        <CreateSelect
          options={getOperations()
            .filter((value) => {
              if (
                acl.resourceType.value === undefined ||
                acl.resourceType.value.toString() === ''
              ) {
                return true;
              }
              const resourceType = snakeCase(acl.resourceType.value.toString());
              const operationType = snakeCase(value);
              return resourceOperations[resourceType].some(
                (p) => p === operationType
              );
            })
            .map((value) => {
              return {
                value,
                title: sentenceCase(value),
              } as SelectOption<AclOperation>;
            })}
          selected={acl.operation}
          setSelected={setOperation}
          row={row}
          id='operation'
          placeholder={t(
            'permission.manage_permissions_dialog.assign_permissions.operation_placeholder'
          )}
          setEscapeClosesModal={setEscapeClosesModal}
          menuAppendTo={menuAppendTo}
          onClear={() => createEmptyNewAcl().operation.value}
          onSelect={(value) => {
            setAcls((prevState) => {
              const newPrevState = handle2DArrayAcls(prevState, row, childRow);
              if (value === undefined) {
                newPrevState.operation.validated = ValidatedOptions.error;
                newPrevState.operation.errorMessage = t(
                  'permission.manage_permissions_dialog.assign_permissions.must_select_operation_error'
                );
              } else {
                newPrevState.operation.validated = ValidatedOptions.default;
              }
              return update2DArrayAcls(prevState, newPrevState, row, childRow);
            });
          }}
        />
      );
    };

    const RemoveButtonCell: React.FunctionComponent<CellProps> = ({ row }) => {
      return (
        <div className='pf-u-display-flex pf-u-justify-content-flex-end'>
          <Tooltip
            content={t(
              'permission.manage_permissions_dialog.assign_permissions.remove_row_help'
            )}
          >
            <Button
              variant='link'
              icon={<TrashIcon />}
              onClick={() => removeRow(row)}
            />
          </Tooltip>
        </div>
      );
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
                  <RemoveButtonCell acl={acl} row={row} />
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
                <ResourceType row={row} acl={acl} childRow={childRow} />
              </Td>
              {acl.aclShortcutType !== AclShortcutType.ManageAccess && (
                <>
                  <Td width={15} noPadding>
                    <PatternTypeCell row={row} acl={acl} childRow={childRow} />
                  </Td>
                  <Td width={25} noPadding>
                    <ResourceCell acl={acl} row={row} childRow={childRow} />
                  </Td>
                </>
              )}
              <Td
                width={acl.aclShortcutType ? 40 : 15}
                colSpan={acl.aclShortcutType ? 3 : 0}
                noPadding
              >
                <PermissionTypeCell acl={acl} row={row} childRow={childRow} />
              </Td>
              {!acl.aclShortcutType && (
                <>
                  <Td width={15} noPadding>
                    <OperationCell acl={acl} row={row} childRow={childRow} />
                  </Td>
                  <Td width={10}>
                    <RemoveButtonCell acl={acl} row={row} />
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
