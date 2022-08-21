import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { RhythmQuizFromState } from '../Model';

const SelectUid = ({
  state,
  dispatch,
}: {
  state: RhythmQuizFromState;
  dispatch: React.Dispatch<RhythmQuizFromState>;
}) => {
  const handleChangeUid = (uid: string) => {
    const updatedState: RhythmQuizFromState = { ...state, uid };
    dispatch(updatedState);
  };
  return (
    <FormControl fullWidth>
      <Select
        value={state.uid}
        onChange={(e) => handleChangeUid(e.target.value)}
      >
        {state.users.map((u) => (
          <MenuItem key={u.id} value={u.id}>
            {u.displayname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectUid;
