import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import {
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from '@mui/material';
import { User } from '../../../../services/useUsers';
import TableLayout from '../../../../components/templates/TableLayout';

const CreateArticlePageComponent = ({
  uid,
  date,
  title,
  users,
  handleSubmit,
  handlePickDate,
  handleChangeUid,
  handleChangeTitle,
}: {
  uid: string;
  date: Date;
  users: User[];
  title: string;
  handleSubmit: () => void;
  handlePickDate: (value: Date | null) => void;
  handleChangeUid: (value: string) => void;
  handleChangeTitle: (value: string) => void;
}) => (
  <TableLayout title={`${title} - 新規`} backURL='/article/list'>
    <div style={{ display: 'grid', rowGap: 16 }}>
      <FormControl>
        <InputLabel>user</InputLabel>
        <Select
          size='small'
          value={uid}
          variant='standard'
          onChange={(e) => handleChangeUid(e.target.value)}
        >
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.displayname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          label='Created at'
          inputFormat='yyyy年MM月dd日'
          value={date}
          onChange={handlePickDate}
          renderInput={(params) => (
            <TextField {...params} size='small' fullWidth />
          )}
        />
      </LocalizationProvider>
      <TextField
        size='small'
        label='title'
        value={title}
        variant='outlined'
        onChange={(e) => handleChangeTitle(e.target.value)}
      />
      <Button variant='contained' color='primary' onClick={handleSubmit}>
        送信
      </Button>
    </div>
  </TableLayout>
);

export default CreateArticlePageComponent;
