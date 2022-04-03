import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../../../services/app';
import {
  Article,
  INITIAL_ARTICLE,
  useHandleArticles,
} from '../../../services/useArticles';
import CreateArticlePageComponent from './components/CreateArticlePageComponent';

const CreateArticlePage = () => {
  const navigate = useNavigate();
  const { users, setArticleId, setIsFetching } = useContext(AppContext);
  const { addArticle } = useHandleArticles();

  const [uid, setUid] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!users.length) return;
    setUid(users[0].id);
  }, [users]);

  const handlePickDate = (date: Date | null) => {
    !!date && setDate(date);
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  const handleChangeUid = (uid: string) => {
    setUid(uid);
  };
  const handleSubmit = async () => {
    const { id, ...omitted } = INITIAL_ARTICLE;

    const article: Omit<Article, 'id'> = {
      ...omitted,
      uid,
      title,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };
    const { success, articleId } = await addArticle(article);
    if (success) {
      setIsFetching(true);
      setArticleId(articleId!);
      navigate(`/article/${articleId!}/initial`);
    }
  };
  return (
    <CreateArticlePageComponent
      uid={uid}
      date={date}
      title={title}
      users={users}
      handleSubmit={handleSubmit}
      handlePickDate={handlePickDate}
      handleChangeUid={handleChangeUid}
      handleChangeTitle={handleChangeTitle}
    />
  );
};

export default CreateArticlePage;
