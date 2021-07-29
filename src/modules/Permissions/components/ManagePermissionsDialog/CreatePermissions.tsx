import {
  AclOperation,
  AclPatternType,
  AclPermissionType,
  AclResourceType,
} from '@rhoas/kafka-instance-sdk';
import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '@app/contexts';
import {
  createPermissionsService,
  getOperations,
  getPatternTypes,
  getPermissionsTypes,
  getResourceTypes,
} from '@app/services/acls';
import { ICell, IRowData, TableVariant } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import { MASLoading, MASTable } from '@app/components';
import { Button, FormGroup, GridItem } from '@patternfly/react-core';
import { CreateSelect } from '@app/modules/Permissions/components/ManagePermissionsDialog/CreateSelect';
import { sentenceCase } from 'sentence-case';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';
import { snakeCase } from 'snake-case';
import { CreateTypeahead } from '@app/modules/Permissions/components/ManagePermissionsDialog/CreateTypeahead';
import { MinusCircleIcon } from '@patternfly/react-icons';
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import {
  createEmptyNewAcl,
  NewAcl,
} from '@app/modules/Permissions/components/ManagePermissionsDialog/acls';

export type CreatePermissionsProps = {
  topicNames: string[];
  consumerGroupIds: string[];
  acls: NewAcl[];
  setAcls: React.Dispatch<React.SetStateAction<NewAcl[]>>;
};

export const CreatePermissions: React.FunctionComponent<CreatePermissionsProps> =
  ({ acls, setAcls, topicNames, consumerGroupIds }) => {
    const config = useContext(ConfigContext);
    const [resourceOperations, setResourceOperations] = useState<
      { [key: string]: Array<string> } | undefined
    >();
    const permissionsService = createPermissionsService(config);
    useEffect(() => {
      const fetchResourceOperations = async () => {
        const resourceOperations =
          await permissionsService.getResourceOperations();
        setResourceOperations(resourceOperations);
      };
      fetchResourceOperations();
    }, []);

    const tableColumns = [
      { title: '' },
      { title: '' },
      { title: '' },
      { title: '' },
      { title: '' },
      { title: '' },
      { title: '' },
    ] as ICell[];
    const { t } = useTranslation();

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
      setAcls((prevState) => prevState.filter((v, k) => k !== row));
    };

    if (resourceOperations === undefined) {
      return <MASLoading />;
    }

    return (
      <GridItem span={12}>
        <FormGroup
          fieldId='createPermissions'
          label={t(
            'permission.manage_permissions_dialog.create_permissions.title'
          )}
          helperText={t(
            'permission.manage_permissions_dialog.create_permissions.help'
          )}
          isHelperTextBeforeField={true}
        >
          <MASTable
            tableProps={{
              cells: tableColumns,
              rows: acls.map((acl, row) => {
                return {
                  cells: [
                    {
                      title: (
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
                        />
                      ),
                    },
                    {
                      title: (
                        <CreateSelect
                          options={getOperations()
                            .filter(() => {
                              return true;
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
                        />
                      ),
                    },
                    {
                      title: (
                        <CreateSelect
                          options={getResourceTypes()
                            .filter((value) => {
                              if (
                                acl.operation.value === undefined ||
                                acl.operation.value.toString() === ''
                              ) {
                                return true;
                              }
                              const aclOperation = snakeCase(
                                acl.operation.value.toString()
                              );
                              const operations =
                                resourceOperations[
                                  snakeCase(value.toString())
                                ] || [];
                              return operations.some(
                                (operation) => aclOperation === operation
                              );
                            })
                            .map((value) => {
                              return {
                                value,
                                title: sentenceCase(value),
                              } as SelectOption<AclResourceType>;
                            })}
                          selected={acl.resourceType}
                          setSelected={setResourceType}
                          row={row}
                          id='resource-type'
                        />
                      ),
                    },
                    {
                      title: (
                        <CreateSelect
                          options={getPatternTypes().map((value) => {
                            return {
                              value,
                              title:
                                value === AclPatternType.Prefixed
                                  ? 'Starts with'
                                  : 'Is',
                            } as SelectOption<AclPatternType>;
                          })}
                          selected={acl.patternType}
                          setSelected={setPatternType}
                          row={row}
                          id='pattern-type'
                        />
                      ),
                    },
                    {
                      title: (
                        <CreateTypeahead
                          row={row}
                          value={acl.resource}
                          setValue={setResource}
                          id='resource'
                          initialOptions={() => {
                            if (
                              acl.resourceType.value === AclResourceType.Topic
                            ) {
                              return topicNames;
                            }
                            if (
                              acl.resourceType.value === AclResourceType.Group
                            ) {
                              return consumerGroupIds;
                            }
                            return [];
                          }}
                        />
                      ),
                    },
                    {
                      title: (
                        <Button
                          variant='link'
                          icon={<MinusCircleIcon />}
                          onClick={() => removeRow(row)}
                        >
                          Remove
                        </Button>
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
          <Button variant='link' icon={<PlusCircleIcon />} onClick={addRow}>
            Add permission
          </Button>
        </FormGroup>
      </GridItem>
    );
  };
