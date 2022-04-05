import React from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
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

const EditArticlePageComponent = ({
  uid,
  date,
  title,
  users,
  embedId,
  articleId,
  handlePickDate,
  handleChangeUid,
  handleClickSubmit,
  handleChangeTitle,
  handleChangeEmbedId,
}: {
  uid: string;
  date: Date;
  users: User[];
  title: string;
  embedId: string;
  articleId: string;
  handlePickDate: (value: Date | null) => void;
  handleChangeUid: (value: string) => void;
  handleClickSubmit: () => void;
  handleChangeTitle: (value: string) => void;
  handleChangeEmbedId: (value: string) => void;
}) => {
  return (
    <TableLayout title={!!articleId ? '新規' : '編集'} backURL='/article/list'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <FormControl fullWidth>
          <InputLabel>user</InputLabel>
          <Select
            size='small'
            value={uid}
            variant='standard'
            onChange={(e) => handleChangeUid(e.target.value as string)}
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
        <TextField
          size='small'
          label='embedID'
          value={embedId}
          variant='outlined'
          onChange={(e) => handleChangeEmbedId(e.target.value)}
        />
        <Button variant='contained' color='primary' onClick={handleClickSubmit}>
          送信
        </Button>
      </div>
    </TableLayout>
  );
};

export default EditArticlePageComponent;
