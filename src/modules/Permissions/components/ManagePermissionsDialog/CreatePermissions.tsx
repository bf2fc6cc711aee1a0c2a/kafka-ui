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
import {
  cellWidth,
  ICell,
  IRowData,
  TableVariant,
} from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import { MASTable } from '@app/components';
import {
  ActionList,
  ActionListItem,
  Button,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from '@patternfly/react-core';
import { CreateSelect } from '@app/modules/Permissions/components/ManagePermissionsDialog/CreateSelect';
import { sentenceCase } from 'sentence-case';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';
import { snakeCase } from 'snake-case';
import { CreateTypeahead } from '@app/modules/Permissions/components/ManagePermissionsDialog/CreateTypeahead';
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';
import {
  createEmptyNewAcl,
  isNewAclModified,
  NewAcl,
} from '@app/modules/Permissions/components/ManagePermissionsDialog/acls';
import { displayName } from '@app/modules/Permissions/utils';
import { useValidateTopic } from '@app/services/topicNameValidation';

export type CreatePermissionsProps = {
  selectedAccount?: string;
  topicNames: string[];
  consumerGroupIds: string[];
  acls: NewAcl[];
  setAcls: React.Dispatch<React.SetStateAction<NewAcl[]>>;
  setEscapeClosesModal: (closes: boolean) => void;
  resourceOperations: { [key: string]: Array<string> };
  menuAppendTo:
    | HTMLElement
    | (() => HTMLElement)
    | 'parent'
    | 'inline'
    | undefined;
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
  }) => {
    const { validateName } = useValidateTopic();
    const { t } = useTranslation();

    const tableColumns = [
      {
        title: t('permission.table.resource_column_title'),
        columnTransforms: [cellWidth(20)],
      },
      {
        title: '',
        columnTransforms: [cellWidth(15)],
      },
      {
        title: '',
        columnTransforms: [cellWidth(25)],
      },
      {
        title: t('permission.table.permissions_column_title'),
        columnTransforms: [cellWidth(20)],
      },
      {
        title: '',
        columnTransforms: [cellWidth(20)],
      },
    ] as ICell[];

    const setPermissionType = (row: number, value?: AclPermissionType) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            v.permission = { value };
          }
          return v;
        })
      );
    };

    const setOperation = (row: number, value?: AclOperation) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            v.operation = { value };
          }
          return v;
        })
      );
    };

    const setResourceType = (row: number, value?: AclResourceType) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            v.resourceType = { value };
          }
          return v;
        })
      );
    };

    const setPatternType = (row: number, value?: AclPatternType) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            v.patternType = { value };
          }
          return v;
        })
      );
    };

    const setResource = (row: number, value?: string) => {
      setAcls((prevState) =>
        prevState.map((v, k) => {
          if (k === row) {
            v.resource = { value };
          }
          return v;
        })
      );
    };

    const addRow = () => {
      setAcls((prevState) => [...prevState, createEmptyNewAcl()]);
    };

    const removeRow = (row: number) => {
      setAcls((prevState) => {
        if (prevState.length > 1) {
          return prevState.filter((v, k) => k !== row);
        }
        return [createEmptyNewAcl()];
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
    };

    const PatternTypeCell: React.FunctionComponent<CellProps> = ({
      acl,
      row,
    }) => {
      if (acl.resourceType.value === AclResourceType.Cluster) {
        return <></>;
      }
      return (
        <CreateSelect
          options={getPatternTypes()
            .map((value) => {
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
          id='pattern-type'
          setEscapeClosesModal={setEscapeClosesModal}
          menuAppendTo={menuAppendTo}
          onClear={() => createEmptyNewAcl().patternType.value}
          onSelect={(value) => {
            setAcls((prevState) => {
              if (value === undefined) {
                prevState[row].patternType.validated = 'error';
                prevState[row].patternType.validated = t(
                  'permission.manage_permissions_dialog.assign_permissions.must_select_pattern_type_error'
                );
              } else {
                prevState[row].patternType.validated = 'success';
              }
              return prevState;
            });
          }}
        />
      );
    };

    const ResourceType: React.FunctionComponent<CellProps> = ({ row, acl }) => {
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
              if (value === undefined) {
                prevState[row].resourceType.validated = 'error';
                prevState[row].resourceType.errorMessage = t(
                  'permission.manage_permissions_dialog.assign_permissions.must_select_resource_type_error'
                );
              } else {
                prevState[row].resourceType.validated = 'success';
              }
              return prevState;
            });
          }}
        />
      );
    };

    const ResourceCell: React.FunctionComponent<CellProps> = ({ row, acl }) => {
      if (acl.resourceType.value === AclResourceType.Cluster) {
        return <></>;
      }
      return (
        <CreateTypeahead
          row={row}
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
            const errorMessage = validateName(value);
            if (errorMessage !== undefined) {
              setAcls((prevState) => {
                prevState[row].resource.validated = 'error';
                prevState[row].resource.errorMessage = errorMessage;
                return prevState;
              });
            } else if (value !== undefined) {
              setAcls((prevState) => {
                prevState[row].resource.validated = 'success';
                return prevState;
              });
            }
          }}
        />
      );
    };

    const PermissionTypeCell: React.FunctionComponent<CellProps> = ({
      acl,
      row,
    }) => {
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
              if (value === undefined) {
                prevState[row].permission.validated = 'error';
                prevState[row].permission.errorMessage = t(
                  'permission.manage_permissions_dialog.assign_permissions.must_select_permission_error'
                );
              } else {
                prevState[row].permission.validated = 'success';
              }
              return prevState;
            });
          }}
        />
      );
    };

    const OperationCell: React.FunctionComponent<CellProps> = ({
      acl,
      row,
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
              if (value === undefined) {
                prevState[row].operation.validated = 'error';
                prevState[row].operation.errorMessage = t(
                  'permission.manage_permissions_dialog.assign_permissions.must_select_operation_error'
                );
              } else {
                prevState[row].operation.validated = 'success';
              }
              return prevState;
            });
          }}
        />
      );
    };

    const RemoveButtonCell: React.FunctionComponent<CellProps> = ({
      row,
      acl,
    }) => {
      return (
        <Tooltip
          content={t(
            'permission.manage_permissions_dialog.assign_permissions.remove_row_help'
          )}
        >
          <Button
            variant='link'
            icon={<TrashIcon />}
            onClick={() => removeRow(row)}
            isDisabled={!isNewAclModified(acl)}
          />
        </Tooltip>
      );
    };

    return (
      <div>
        <TextContent>
          <Text component={TextVariants.h2}>
            {t('permission.manage_permissions_dialog.assign_permissions.title')}
          </Text>
          <Text component={TextVariants.small}>{formGroupHelperText()}</Text>
        </TextContent>

        <MASTable
          tableProps={{
            cells: tableColumns,
            rows: acls.map((acl, row) => {
              return {
                cells: [
                  {
                    title: <ResourceType row={row} acl={acl} />,
                  },
                  {
                    title: <PatternTypeCell row={row} acl={acl} />,
                  },
                  {
                    title: <ResourceCell acl={acl} row={row} />,
                  },
                  {
                    title: <PermissionTypeCell acl={acl} row={row} />,
                  },
                  {
                    title: (
                      <div className='pf-u-display-flex pf-u-justify-content-space-between'>
                        <div>
                          <OperationCell acl={acl} row={row} />
                        </div>
                        <div>
                          <RemoveButtonCell acl={acl} row={row} />
                        </div>
                      </div>
                    ),
                  },
                ],
              } as IRowData;
            }),
            'aria-label': t('permission.table.table.permission_list_table'),
            shouldDefaultCustomRowWrapper: true,
            variant: TableVariant.compact,
            canSelectAll: false,
          }}
          rowDataTestId={'tablePermissions-row'}
        />
        <ActionList>
          <ActionListItem>
            <Button variant='link' icon={<PlusCircleIcon />} onClick={addRow}>
              {t(
                'permission.manage_permissions_dialog.assign_permissions.add_row'
              )}
            </Button>
          </ActionListItem>
        </ActionList>
      </div>
    );
  };
