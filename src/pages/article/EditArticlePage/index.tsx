import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { Divider } from '@mui/material';

import { AppContext } from '../../../services/app';
import EditArticlePageComponent from './components/EditArticlePageComponent';

import {
  Article,
  INITIAL_ARTICLE,
  useHandleArticles,
} from '../../../services/useArticles';
import EditArticleVoicePane from './components/EditArticleVoicePane';
import EditAssignmentVoicePane from './components/EditAssignmentVoicePane';

const EditArticlePage = () => {
  const navigate = useNavigate();
  const { addArticle, updateArticle } = useHandleArticles();
  const {
    users,
    article,
    sentences,
    assignment,
    isFetching,
    assignmentSentences,
  } = useContext(AppContext);

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
    const { success } = await addArticle(article);
    if (success) {
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
    const { success } = await updateArticle(newArticle);
    if (success) {
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

  if (isFetching) {
    return <></>;
  } else {
    return (
      <div style={{ display: 'grid', rowGap: 16, paddingBottom: 120 }}>
        <EditArticlePageComponent
          uid={uid}
          date={date}
          title={title}
          users={users}
          embedId={embedId}
          articleId={article.id}
          articleMarksString={articleMarksString}
          handlePickDate={handlePickDate}
          handleChangeUid={handleChangeUid}
          handleClickSubmit={handleClickSubmit}
          handleChangeTitle={handleChangeTitle}
          handleChangeEmbedId={handleChangeEmbedId}
          handleChangeArticleMarksString={handleChangeArticleMarksString}
        />
        {!!article.id && (
          <>
            <Divider />
            <EditArticleVoicePane article={article} sentences={sentences} />
          </>
        )}
        {!!article.id && (
          <>
            <Divider />
            <EditAssignmentVoicePane
              article={article}
              sentences={sentences}
              assignment={assignment}
              assignmentSentences={assignmentSentences}
            />
          </>
        )}
      </div>
    );
  }
};

export default EditArticlePage;
