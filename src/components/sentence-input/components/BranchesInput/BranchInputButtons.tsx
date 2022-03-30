import { Delete } from '@mui/icons-material';
import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';

import { Branch } from '../../entities/Branch';
import { SentenceInputContext } from '../../sentence-input';
import { useBranchInputButtons } from '../../services/branchInputButtons';

const BranchInputButtons: React.FC<{
  branchID: string;
  branchIDs: string[];
  isTopicBranch?: boolean;
  isRentaiBranch: boolean;
}> = ({ branchID, branchIDs, isTopicBranch, isRentaiBranch }) => {
  const { onToggleLock } = useBranchInputButtons();
  const { globalBranches, onRemoveBranch } = useContext(SentenceInputContext);
  const branch: Branch | null = globalBranches[branchID];
  if (!!branch) {
    return (
      <div>
        <div
          style={{
            marginTop: -8,
            marginBottom: -8,
            position: 'relative',
            top: -2,
          }}
        >
          {branchIDs.length > 1 && (
            <Tooltip title="順序固定">
              <IconButton size="small" onClick={() => onToggleLock(branchID)}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: !!branch.lock ? '#5390e4' : '#ccc',
                      borderRadius: '50%',
                    }}
                  />
                </div>
              </IconButton>
            </Tooltip>
          )}
        </div>
        <IconButton
          size="small"
          style={{
            color: isRentaiBranch ? '#FF4E62' : 'yellowgreen',
            opacity: isRentaiBranch ? 0.8 : 0.4,
          }}
          onClick={() => {
            onRemoveBranch(branchID);
          }}
        >
          <Tooltip
            title={`${
              isRentaiBranch ? '名詞修飾語' : isTopicBranch ? '主題' : '補足語'
            }削除`}
          >
            <Delete />
          </Tooltip>
        </IconButton>
      </div>
    );
  } else {
    return <div />;
  }
};

export default BranchInputButtons;
