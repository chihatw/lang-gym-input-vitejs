import * as R from 'ramda';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ArticleEditState } from './Model';
import { Article, State } from '../../../Model';
import { AppContext } from '../../../App';
import { ActionTypes } from '../../../Update';
import { setArticle } from '../../../services/article';

const EditArticleForm = ({
  state,
  dispatch,
}: {
  state: ArticleEditState;
  dispatch: React.Dispatch<ArticleEditState>;
}) => {
  const navigate = useNavigate();
  const { state: appState, dispatch: appDispatch } = useContext(AppContext);

  const handleSubmit = () => {
    // update remote
    setArticle(state.article);

    //  update appState
    const updatedAppState = R.assocPath<Article, State>(
      ['articles', state.article.id],
      state.article
    )(appState);
    appDispatch({ type: ActionTypes.setState, payload: updatedAppState });

    // no update formState
    navigate(`/article/list`);
  };

  const handleChangeUid = (uid: string) => {
    const user = state.users.filter((item) => item.id === uid)[0];
    const updatedState = R.compose(
      R.assocPath<string, ArticleEditState>(['article', 'uid'], uid),
      R.assocPath<string, ArticleEditState>(
        ['article', 'userDisplayname'],
        user!.displayname
      )
    )(state);
    console.log(updatedState.article);
    dispatch(updatedState);
  };
  const handlePickDate = (date: Date | null) => {
    if (!date) return;
    const updatedState = R.assocPath<number, ArticleEditState>(
      ['article', 'createdAt'],
      new Date(date).getTime()
    )(state);
    dispatch(updatedState);
  };
  const handleChangeTitle = (title: string) => {
    const updatedState = R.assocPath<string, ArticleEditState>(
      ['article', 'title'],
      title
    )(state);
    dispatch(updatedState);
  };

  return (
    <Container maxWidth='sm' sx={{ paddingTop: 4 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <div>
          <Typography variant='h5'>
            {state.article.title || '新規作成'}
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
            value={state.article.uid}
            variant='standard'
            onChange={(e) => handleChangeUid(e.target.value as string)}
          >
            {state.users.map((u) => (
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
            value={new Date(state.article.createdAt)}
            onChange={handlePickDate}
            renderInput={(params) => (
              <TextField {...params} size='small' fullWidth />
            )}
          />
        </LocalizationProvider>
        <TextField
          size='small'
          label='title'
          value={state.article.title}
          variant='outlined'
          onChange={(e) => handleChangeTitle(e.target.value)}
        />

        <Button variant='contained' color='primary' onClick={handleSubmit}>
          送信
        </Button>
      </div>
    </Container>
  );
};

export default EditArticleForm;
