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
  Container,
} from '@mui/material';

import { User } from '../../../../services/useUsers';
import TableLayoutHeader from '../../../../components/organisms/TableLayoutHeader';
import { YoutubeEmbeded } from '@chihatw/lang-gym-h.ui.youtube-embeded';

const EditArticlePageComponent = ({
  uid,
  date,
  title,
  users,
  embedId,
  articleId,
  articleMarksString,
  handlePickDate,
  handleChangeUid,
  handleClickSubmit,
  handleChangeTitle,
  handleChangeEmbedId,
  handleChangeArticleMarksString,
}: {
  uid: string;
  date: Date;
  users: User[];
  title: string;
  embedId: string;
  articleId: string;
  articleMarksString: string;
  handlePickDate: (value: Date | null) => void;
  handleChangeUid: (value: string) => void;
  handleClickSubmit: () => void;
  handleChangeTitle: (value: string) => void;
  handleChangeEmbedId: (value: string) => void;
  handleChangeArticleMarksString: (value: string) => void;
}) => {
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 4 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <TableLayoutHeader
          title={!articleId ? '作文新規' : '作文編集'}
          backURL={'/article/list'}
        />
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
        {!!embedId && (
          <div style={{ padding: '16px 0 24px', width: 480 }}>
            <YoutubeEmbeded
              embedId={embedId}
              offSet={400}
              transition={1000}
              isShowControls={false}
            />
          </div>
        )}
        <TextField
          size='small'
          label='marks'
          value={articleMarksString}
          variant='outlined'
          onChange={(e) => handleChangeArticleMarksString(e.target.value)}
          multiline
        />
        <Button variant='contained' color='primary' onClick={handleClickSubmit}>
          送信
        </Button>
      </div>
    </Container>
  );
};

export default EditArticlePageComponent;
