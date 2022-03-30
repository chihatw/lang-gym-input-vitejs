import React from 'react';
import hinshiTexts from 'hinshi-texts';
import { MenuItem, Select, TextField } from '@mui/material';

import { useWordInput } from '../services/wordInput';

const WordInput: React.FC<{
  wordID: string;
  unitID: string;
}> = ({ wordID, unitID }) => {
  const { text, hinshi, hinshis, onFocus, onChangeText, onChangeHinshi } =
    useWordInput(wordID, unitID);
  return (
    <div style={{ display: 'flex' }}>
      {!!hinshis.length && (
        <>
          <Select
            size='small'
            variant='standard'
            value={hinshi}
            onChange={(e) =>
              onChangeHinshi(unitID, wordID, e.target.value as string)
            }
          >
            {hinshis.map((hinshi) => (
              <MenuItem key={hinshi} value={hinshi}>
                {hinshiTexts[hinshi]}
              </MenuItem>
            ))}
          </Select>
          <div style={{ width: 4 }} />
        </>
      )}

      <TextField
        id={`txt_${wordID}`}
        variant='outlined'
        size='small'
        value={text}
        onFocus={onFocus}
        onChange={(e) => onChangeText(e.target.value)}
      />
      <span
        id={`textMetrics_${wordID}`}
        style={{
          display: 'inline-block',
          position: 'absolute',
          height: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          clip: 'rect(0 0 0 0)',
          clipPath: 'inset(50%)',
        }}
      ></span>
    </div>
  );
};

export default WordInput;
