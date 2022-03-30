import React, { useContext } from 'react';
import { MenuItem, Select, Tooltip } from '@mui/material';

import { Unit } from '../entities/Unit';
import { Word } from '../entities/Word';
import WordInput from './WordInput';
import { useUnitInput } from '../services/unitInput';
import setsuzokuJoshiTexts from 'setsuzokujoshi-texts';
import RentaiBranchesInput from './BranchesInput/RentaiBranchesInput';
import RenyouBranchesInput from './BranchesInput/RenyouBranchesInput';
import { SentenceInputContext } from '../sentence-input';

const UnitInput: React.FC<{ unitID: string }> = ({ unitID }) => {
  const { hasMeishiKu, isCommentUnit, setsuzokuJoshi, onChangeSetsuzokuJoshi } =
    useUnitInput(unitID);
  const { globalUnits, globalWords } = useContext(SentenceInputContext);
  const unit: Unit | null = globalUnits[unitID];
  if (!!unit) {
    const word: Word | null = globalWords[unit.wordID];
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {!hasMeishiKu && <RenyouBranchesInput unitID={unitID} />}

        <MeishiKuBorder isMeishiku={hasMeishiKu}>
          <div style={{ display: 'flex' }}>
            {hasMeishiKu && <RentaiBranchesInput unitID={unitID} />}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <WordInput wordID={unit.wordID} unitID={unitID} />
            </div>
          </div>
        </MeishiKuBorder>

        {isCommentUnit && !!word && !!word.text && (
          <div style={{ marginLeft: 4 }}>
            <Tooltip title="接続助詞" placement="right-end">
              <Select
                size="small"
                variant="standard"
                value={setsuzokuJoshi}
                onChange={(e) =>
                  onChangeSetsuzokuJoshi(e.target.value as string)
                }
              >
                {['none']
                  .concat(Object.keys(setsuzokuJoshiTexts))
                  .map((item) => (
                    <MenuItem key={item} value={item}>
                      {setsuzokuJoshiTexts[item] || '　'}
                    </MenuItem>
                  ))}
              </Select>
            </Tooltip>
          </div>
        )}
      </div>
    );
  } else {
    return <div />;
  }
};

export default UnitInput;

const MeishiKuBorder: React.FC<{ isMeishiku: boolean }> = ({
  children,
  isMeishiku,
}) => {
  if (isMeishiku) {
    return (
      <div
        style={{
          padding: 4,
          borderRadius: 4,
          border: '1px dashed red',
          marginRight: 4,
        }}
      >
        {children}
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
};
