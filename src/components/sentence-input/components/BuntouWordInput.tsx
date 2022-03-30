import { MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import hinshiTexts from 'hinshi-texts';
import { useBuntouWordInput } from '../services/buntouWordInput';

const BuntouWordInput: React.FC<{ wordID: string }> = ({ wordID }) => {
  const { text, hinshi, hinshis, onFocus, onChangeText, onChangeHinshi } =
    useBuntouWordInput(wordID);
  return (
    <div style={{ display: 'flex' }}>
      <Select
        size='small'
        variant='standard'
        value={hinshi}
        onChange={(e) => onChangeHinshi(e.target.value as string)}
      >
        {hinshis.map((hinshi) => (
          <MenuItem key={hinshi} value={hinshi}>
            {hinshiTexts[hinshi]}
          </MenuItem>
        ))}
      </Select>
      <div style={{ width: 4 }} />
      <TextField
        id={`txt_${wordID}`}
        variant='outlined'
        size='small'
        style={{ width: 120 }}
        value={text}
        onFocus={onFocus}
        onChange={(e) => onChangeText(e.target.value)}
      />
      <div style={{ width: 4 }} />
    </div>
  );
};

export default BuntouWordInput;
