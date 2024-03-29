import React, { createContext, useContext } from 'react';
import { css } from '@patternfly/react-styles';
import './CustomRowWrapper.css';
import { IRowData, RowWrapperProps } from '@patternfly/react-table';

export type CustomRowWrapperContextProps = {
  activeRow?: string;
  onRowClick?: (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    rowIndex?: number,
    row?: IRowData
  ) => void;
  rowDataTestId?: string;
  loggedInUser?: string;
};

const CustomRowWrapperContext = createContext<CustomRowWrapperContextProps>({
  activeRow: '',
  onRowClick: () => '',
  loggedInUser: '',
});

export const CustomRowWrapperProvider = CustomRowWrapperContext.Provider;

export const CustomRowWrapper = (
  rowWrapperProps: RowWrapperProps
): JSX.Element => {
  const { activeRow, onRowClick, rowDataTestId } = useContext(
    CustomRowWrapperContext
  );
  const { trRef, className, rowProps, row, ...props } = rowWrapperProps || {};
  const { rowIndex } = rowProps || {};
  const { isExpanded, originalData } = row || {};

  return (
    <tr
      data-testid={rowDataTestId}
      tabIndex={0}
      ref={typeof trRef === 'function' ? undefined : trRef}
      className={css(
        className,
        'pf-c-table-row__item',
        activeRow &&
          activeRow === originalData?.rowId &&
          'pf-m-selected pf-m-selectable'
      )}
      hidden={isExpanded !== undefined && !isExpanded}
      onClick={(event) => onRowClick && onRowClick(event, rowIndex, row)}
      {...props}
    />
  );
};
