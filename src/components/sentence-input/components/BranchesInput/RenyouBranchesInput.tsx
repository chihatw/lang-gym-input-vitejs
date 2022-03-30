import { Add } from '@mui/icons-material';
import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';

import { Unit } from '../../entities/Unit';
import BranchesInputBase from './BranchesInputBase';
import { SentenceInputContext } from '../../sentence-input';
import { useRenyouBranchesInput } from '../../services/renyouBranchesInput';

const RenyouBranchesInput: React.FC<{
  unitID: string;
  isTopicBranch?: boolean;
}> = ({ unitID, isTopicBranch }) => {
  const { disabledAddBranch } = useRenyouBranchesInput(unitID);
  const { globalUnits, onAddMeishiRenyouBranch } =
    useContext(SentenceInputContext);
  const unit: Unit | null = globalUnits[unitID];
  if (!!unit) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {!!unit.branchIDs.length && (
          <BranchesInputBase
            unitID={unitID}
            isTopicBranch={isTopicBranch}
            isRentaiBranch={false}
          />
        )}
        {!disabledAddBranch && (
          <IconButton
            size="small"
            onClick={() =>
              onAddMeishiRenyouBranch({
                unitID,
                kakuJoshi: 'ga',
                kakariJoshi: '',
              })
            }
            style={{ color: 'yellowgreen' }}
          >
            <Tooltip title="補足語追加">
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

export default RenyouBranchesInput;
