import { MenuItem, Select } from '@mui/material';
import React from 'react';
import kakuJoshiTexts from 'kakujoshi-texts';
import kakariJoshiTexts from 'kakarijoshi-texts';
import { useJoshiInput } from '../services/joshiInput';

const JoshiInput: React.FC<{
  branchID: string;
  type: 'kakuJoshi' | 'kakariJoshi';
}> = ({ branchID, type }) => {
  const { joshis, value, onChangeValue } = useJoshiInput({ type, branchID });
  return (
    <Select
      size='small'
      variant='standard'
      value={value}
      onChange={(e) => onChangeValue(e.target.value as string)}
    >
      {joshis.map((joshi) => (
        <MenuItem key={joshi} value={joshi}>
          {(type === 'kakuJoshi'
            ? kakuJoshiTexts[joshi]
            : kakariJoshiTexts[joshi]) || '　'}
        </MenuItem>
      ))}
    </Select>
  );
};

export default JoshiInput;
