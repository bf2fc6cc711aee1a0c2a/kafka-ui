import React, { FunctionComponent } from 'react';
import {
  TableHeader,
  Table as PFTable,
  TableBody,
  TableProps as PFTableProps,
  HeaderProps,
  TableBodyProps,
} from '@patternfly/react-table';
import { css } from '@patternfly/react-styles';
import {
  CustomRowWrapper,
  CustomRowWrapperProvider,
  CustomRowWrapperContextProps,
} from './CustomRowWrapper';

export type MASTableProps = CustomRowWrapperContextProps & {
  tableProps: Omit<PFTableProps, 'children'> & {
    shouldDefaultCustomRowWrapper?: boolean;
  };
  tableHeaderProps?: Omit<HeaderProps, 'children'>;
  tableBodyProps?: Omit<TableBodyProps, 'children'>;
  children?: React.ReactNode;
  ouiaId?: string;
};

const MASTable: FunctionComponent<MASTableProps> = ({
  tableProps,
  tableHeaderProps,
  tableBodyProps,
  children,
  activeRow,
  onRowClick,
  rowDataTestId,
  loggedInUser,
  ouiaId,
}) => {
  const {
    cells,
    rows,
    actionResolver,
    onSort,
    sortBy,
    'aria-label': ariaLabel,
    variant,
    className,
    shouldDefaultCustomRowWrapper = false,
    ...restProps
  } = tableProps;

  /**
   * Handle CustomRowWrapper
   */
  if (shouldDefaultCustomRowWrapper) {
    restProps['rowWrapper'] = CustomRowWrapper;
  }

  return (
    <CustomRowWrapperProvider
      value={{
        activeRow,
        onRowClick,
        rowDataTestId,
        loggedInUser,
      }}
    >
      <PFTable
        className={css(
          shouldDefaultCustomRowWrapper && 'mas--table-view__table',
          className
        )}
        cells={cells}
        variant={variant}
        rows={rows}
        aria-label={ariaLabel}
        actionResolver={actionResolver}
        onSort={onSort}
        sortBy={sortBy}
        {...restProps}
        ouiaId={ouiaId}
      >
        <TableHeader {...tableHeaderProps} />
        <TableBody {...tableBodyProps} />
        {children}
      </PFTable>
    </CustomRowWrapperProvider>
  );
};

export { MASTable };
