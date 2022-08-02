import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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

import { useHandleArticles } from '../../../services/useArticles';
import EditArticleVoicePane from './components/EditArticleVoicePane';
import {
  Article,
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
  State,
} from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getUsers } from '../../../services/user';
import { useParams } from 'react-router-dom';
import { getArticle } from '../../../services/article';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { YoutubeEmbeded } from '@chihatw/lang-gym-h.ui.youtube-embeded';

const EditArticlePage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { articleId } = useParams();

  const navigate = useNavigate();
  const { article, isFetching, users, sentences, memo } = state;

  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      let _users = !!users.length ? users : await getUsers();
      if (!articleId) {
        dispatch({
          type: ActionTypes.setArticleForm,
          payload: {
            users: _users,
            article: INITIAL_ARTICLE,
            sentences: [],
            articleSentenceForms: [],
          },
        });
        return;
      }
      let _article = INITIAL_ARTICLE;
      let _sentences: ArticleSentence[] = [];
      let _articleSentenceForms: ArticleSentenceForm[] = [];

      const memoArticle = memo.articles[articleId];
      const memoSentences = memo.sentences[articleId];
      const memoArticleSentenceForms = memo.articleSentenceForms[articleId];

      if (memoArticle && memoSentences && memoArticleSentenceForms) {
        _article = memoArticle;
        _sentences = memoSentences;
        _articleSentenceForms = memoArticleSentenceForms;
      } else {
        const { article, sentences, articleSentenceForms } = await getArticle(
          articleId
        );
        _article = article;
        _sentences = sentences;
        _articleSentenceForms = articleSentenceForms;
      }

      dispatch({
        type: ActionTypes.setArticleForm,
        payload: {
          users: _users,
          article: _article,
          sentences: _sentences,
          articleSentenceForms: _articleSentenceForms,
        },
      });
    };
    fetchData();
  }, [isFetching]);

  const { addArticle, updateArticle } = useHandleArticles();

  const [uid, setUid] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [embedId, setEmbedId] = useState('');
  const [articleMarksString, setArticleMarksString] = useState('');

  useEffect(() => {
    if (!users.length) return;
    setUid(users[0].id);
  }, [users]);

  // フォームの初期値設定
  useEffect(() => {
    if (!article.id) return;
    setUid(article.uid);
    setDate(new Date(article.createdAt));
    setTitle(article.title);
    setEmbedId(article.embedID);
    if (!sentences) return;
    const lines: string[] = [];
    sentences.forEach(({ japanese }, index) => {
      const items: string[] = [];
      const mark = article.marks[index];
      const initial = index === 0 ? '' : '0:00';
      items.push(mark || initial);
      const hasMore = japanese.length > 5 ? '…' : '';
      items.push(japanese.slice(0, 5) + hasMore);
      const line = items.join(' ');
      lines.push(line);
    });
    const marksString = lines.join('\n');
    setArticleMarksString(marksString);
  }, [article, sentences]);

  const handlePickDate = (date: Date | null) => {
    !!date && setDate(date);
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  const handleChangeUid = (uid: string) => {
    setUid(uid);
  };
  const handleChangeEmbedId = (value: string) => {
    setEmbedId(value);
  };
  const handleChangeArticleMarksString = (value: string) => {
    setArticleMarksString(value);
  };

  const create = async () => {
    const { id, ...omitted } = INITIAL_ARTICLE;

    const article: Omit<Article, 'id'> = {
      ...omitted,
      uid,
      title,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };
    const result = await addArticle(article);
    if (!!result) {
      navigate(`/article/list`);
    }
  };

  const buildArticleMarks = (value: string) => {
    let articleMarks: string[] = [];
    const lines = value.split('\n');
    lines.forEach((line) => {
      const items = line.split(' ');
      articleMarks.push(items[0]);
    });
    return articleMarks;
  };

  const update = async () => {
    const articleMarks = buildArticleMarks(articleMarksString);

    const newArticle: Article = {
      ...article,
      uid,
      marks: articleMarks,
      title,
      embedID: embedId,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };
    const result = await updateArticle(newArticle);
    if (!!result) {
      navigate('/article/list');
    }
  };

  const handleClickSubmit = () => {
    if (!!article.id) {
      update();
    } else {
      create();
    }
  };

  return (
    <div style={{ display: 'grid', rowGap: 16, paddingBottom: 120 }}>
      <Container maxWidth='sm' sx={{ paddingTop: 4 }}>
        <div style={{ display: 'grid', rowGap: 16 }}>
          <div>
            <Typography variant='h5'>{title}</Typography>
            <div style={{ height: 16 }} />
            <Button
              variant='contained'
              onClick={() => navigate('/article/list')}
            >
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
          <Button
            variant='contained'
            color='primary'
            onClick={handleClickSubmit}
          >
            送信
          </Button>
        </div>
      </Container>
      {!!article.id && (
        <>
          <Divider />
          <EditArticleVoicePane state={state} dispatch={dispatch} />
        </>
      )}
    </div>
  );
};

export default EditArticlePage;
