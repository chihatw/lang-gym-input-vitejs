import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@mui/material';
import React from 'react';
import { User } from '../../../../entities/User';

const CreateUidOndoku: React.FC<{
  users: User[];
  uid: string;
  onChangeUid: (uid: string) => void;
  onSubmit: () => void;
}> = ({ users, uid, onChangeUid, onSubmit }) => {
  return (
    <Grid container direction='column' spacing={2}>
      <Grid item>
        <FormControl fullWidth>
          <InputLabel>user</InputLabel>
          <Select
            value={uid}
            onChange={(e) => onChangeUid(e.target.value as string)}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.displayname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <Button variant='contained' onClick={onSubmit} fullWidth>
          送信
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateUidOndoku;
