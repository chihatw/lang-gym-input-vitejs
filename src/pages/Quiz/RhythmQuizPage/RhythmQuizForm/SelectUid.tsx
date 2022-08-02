import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { User } from '../../../../Model';
import { RhythmQuizState } from '../Model';
import { RhythmQuizAction, RhythmQuizActionTypes } from '../Update';

const SelectUid = ({
  state,
  dispatch,
  users,
}: {
  state: RhythmQuizState;
  dispatch: React.Dispatch<RhythmQuizAction>;
  users: User[];
}) => {
  const { uid } = state;
  return (
    <FormControl fullWidth>
      <Select
        value={uid}
        onChange={(e) => {
          dispatch({
            type: RhythmQuizActionTypes.changeUid,
            payload: e.target.value,
          });
        }}
      >
        {users.map((u) => (
          <MenuItem key={u.id} value={u.id}>
            {u.displayname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectUid;
