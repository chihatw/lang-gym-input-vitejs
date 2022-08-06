import { useParams } from 'react-router-dom';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { YoutubeEmbeded } from '@chihatw/lang-gym-h.ui.youtube-embeded';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ArticleEditState } from './Model';
import { ArticleEditAction, ArticleEditActionTypes } from './Update';

const EditArticleForm = ({
  state,
  dispatch,
  handleSubmit,
}: {
  state: ArticleEditState;
  dispatch: React.Dispatch<ArticleEditAction>;
  handleSubmit: () => void;
}) => {
  const navigate = useNavigate();
  const { title, uid, users, date, embedId, articleMarksString } = state;

  const handleChangeUid = (uid: string) => {
    dispatch({ type: ArticleEditActionTypes.changeUid, payload: uid });
  };
  const handlePickDate = (date: Date | null) => {
    if (!date) return;
    dispatch({ type: ArticleEditActionTypes.changeDate, payload: date });
  };
  const handleChangeTitle = (title: string) => {
    dispatch({ type: ArticleEditActionTypes.changeTitle, payload: title });
  };
  const handleChangeEmbedId = (embedId: string) => {
    dispatch({ type: ArticleEditActionTypes.changeEmbedId, payload: embedId });
  };
  const handleChangeArticleMarksString = (articleMarksString: string) => {
    dispatch({
      type: ArticleEditActionTypes.changeMarksString,
      payload: articleMarksString,
    });
  };
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 4 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <div>
          <Typography variant='h5'>{title}</Typography>
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
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          送信
        </Button>
      </div>
    </Container>
  );
};

export default EditArticleForm;
