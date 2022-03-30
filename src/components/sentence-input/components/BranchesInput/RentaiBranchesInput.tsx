import { Add } from '@mui/icons-material';
import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';

import { Unit } from '../../entities/Unit';
import BranchesInputBase from './BranchesInputBase';
import { SentenceInputContext } from '../../sentence-input';
import { useRentaiBranchesInput } from '../../services/rentaiBranchesInput';

const RentaiBranchesInput: React.FC<{ unitID: string }> = ({ unitID }) => {
  const { disabledAddBranch } = useRentaiBranchesInput(unitID);
  const { globalUnits, onAddMeishiRentaiBranch } =
    useContext(SentenceInputContext);
  const unit: Unit | null = globalUnits[unitID];
  if (!!unit) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {!!unit.branchIDs.length && (
          <BranchesInputBase unitID={unitID} isRentaiBranch={true} />
        )}
        {!disabledAddBranch && (
          <IconButton
            size="small"
            onClick={() => onAddMeishiRentaiBranch(unitID)}
            style={{ color: '#ff4e62' }}
          >
            <Tooltip title="名詞修飾語追加">
              <Add />
            </Tooltip>
          </IconButton>
        )}
      </div>
    );
  } else {
    return <div />;
  }
};

export default RentaiBranchesInput;
