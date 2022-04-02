import React from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Button,
  Select,
  Switch,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import { User } from '../../services/useUsers';

const ArticleForm = ({
  uid,
  date,
  users,
  switchItems,
  textFieldItems,
  onSubmit,
  onPickDate,
  onChangeUid,
}: {
  users: User[];
  uid: string;
  onChangeUid: (value: string) => void;
  date: Date;
  onPickDate: (value: Date | null) => void;
  switchItems: {
    label: string;
    checked: boolean;
    onChange: () => void;
  }[];
  textFieldItems: {
    label: string;
    value: string;
    onChange: (text: string) => void;
  }[];
  onSubmit: () => void;
}) => (
  <div>
    {users.length && (
      <>
        <FormControl fullWidth>
          <InputLabel>user</InputLabel>
          <Select
            size='small'
            value={uid}
            variant='standard'
            onChange={(e) => onChangeUid(e.target.value as string)}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.displayname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ height: 16 }} />
      </>
    )}

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        label='Created at'
        inputFormat='yyyy年MM月dd日'
        value={date}
        onChange={onPickDate}
        renderInput={(params) => (
          <TextField {...params} size='small' fullWidth />
        )}
      />
    </LocalizationProvider>
    <div style={{ height: 16 }} />

    {switchItems.map((item, index) => (
      <div key={index}>
        <FormControlLabel
          label={item.label}
          control={
            <Switch
              checked={item.checked}
              color='primary'
              onChange={item.onChange}
            />
          }
        />
      </div>
    ))}
    <div style={{ height: 16 }} />
    {textFieldItems.map((item, index) => (
      <div key={index}>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label={item.label}
          value={item.value}
          onChange={(e) => item.onChange(e.target.value)}
        />
        {!!textFieldItems[index + 1] && <div style={{ height: 16 }} />}
      </div>
    ))}
    <div style={{ height: 16 }} />
    <Button
      variant='contained'
      color='primary'
      fullWidth
      onClick={onSubmit}
      style={{ fontFamily: '"M PLUS Rounded 1c"' }}
    >
      送信
    </Button>
  </div>
);

export default ArticleForm;
