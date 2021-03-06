import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '../../services/useUsers';
import { useSelectUser } from './services/selectUser';

/**
 * このコンポーネントは上位に\<BrowserRouter\>コンポーネントが必要
 * OndokuAssignment.tsx のみで使用中
 */

const SelectUser: React.FC<{
  users: User[];
  onChangeUid?: (uid: string) => void;
}> = ({ users, onChangeUid }) => {
  const query = new URLSearchParams(useLocation().search);
  const uid = query.get('uid') || '';
  const { value, onChangeValue } = useSelectUser(users, uid, onChangeUid);
  return (
    <FormControl fullWidth>
      <InputLabel>User</InputLabel>
      <Select value={value} onChange={(e) => onChangeValue(e.target.value)}>
        {users.map((u) => (
          <MenuItem key={u.id} value={u.id}>
            {u.displayname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectUser;
