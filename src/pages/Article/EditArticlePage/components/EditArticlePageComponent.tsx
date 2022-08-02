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
  Typography,
} from '@mui/material';

import { YoutubeEmbeded } from '@chihatw/lang-gym-h.ui.youtube-embeded';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';
import { useNavigate } from 'react-router-dom';

const EditArticlePageComponent = ({
  state,
  dispatch,
  uid,
  date,
  title,
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
  state: State;
  dispatch: React.Dispatch<Action>;
  uid: string;
  date: Date;
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
  const { users } = state;
  const navigate = useNavigate();
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 4 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <div>
          <Typography variant='h5'>
            {!articleId ? '作文新規' : '作文編集'}
          </Typography>
          <div style={{ height: 16 }} />
          <Button variant='contained' onClick={() => navigate('/article/list')}>
            戻る
          </Button>
          <div style={{ height: 16 }} />
        </div>
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
