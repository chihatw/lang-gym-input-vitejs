import React, { useContext } from 'react';

import UnitInput from './UnitInput';
import JoshiInput from './JoshiInput';
import { useBranchInput } from '../services/branchInput';
import { SentenceInputContext } from '../sentence-input';

const BranchInput: React.FC<{ branchID: string }> = ({ branchID }) => {
  const { hasKakuJoshi, hasKakariJoshi, hasRentaiJoshi, rentaiJoshiText } =
    useBranchInput(branchID);
  const { globalBranches } = useContext(SentenceInputContext);
  const branch = globalBranches[branchID];
  if (!!branch) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <UnitInput unitID={branch.unitID} />
        {hasKakuJoshi && (
          <>
            <div style={{ width: 4 }} />
            <JoshiInput branchID={branchID} type="kakuJoshi" />
          </>
        )}
        {hasKakariJoshi && (
          <>
            <div style={{ width: 4 }} />
            <JoshiInput branchID={branchID} type="kakariJoshi" />
          </>
        )}
        {hasRentaiJoshi && (
          <div
            style={{
              width: 32,
              height: 35,
              lineHeight: '35px',
              textAlign: 'center',
            }}
          >
            {rentaiJoshiText}
          </div>
        )}
      </div>
    );
  } else {
    return <div />;
  }
};

export default BranchInput;
