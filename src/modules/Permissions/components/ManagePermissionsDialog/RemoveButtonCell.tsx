import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip, Button } from '@patternfly/react-core';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';
import { CellProps } from './acls';

type RemoveButtonCellProps = CellProps & {
  removeRow: (row: number) => void;
};

const RemoveButtonCell: React.VFC<RemoveButtonCellProps> = ({
  row,
  removeRow,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

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

export { RemoveButtonCell };
