import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../../../services/app';
import EditArticlePageComponent from './components/EditArticlePageComponent';
import {
  Article,
  INITIAL_ARTICLE,
  useHandleArticles,
} from '../../../services/useArticles';

const EditArticlePage = () => {
  const navigate = useNavigate();
  const { users, setArticleId, setIsFetching, article, isFetching } =
    useContext(AppContext);
  const { addArticle, updateArticle } = useHandleArticles();

  const [uid, setUid] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [embedId, setEmbedId] = useState('');

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
  }, [article]);

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
  const create = async () => {
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

  const update = async () => {
    const newArticle: Article = {
      ...article,
      uid,
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
      <EditArticlePageComponent
        uid={uid}
        date={date}
        title={title}
        users={users}
        embedId={embedId}
        articleId={article.id}
        handlePickDate={handlePickDate}
        handleChangeUid={handleChangeUid}
        handleClickSubmit={handleClickSubmit}
        handleChangeTitle={handleChangeTitle}
        handleChangeEmbedId={handleChangeEmbedId}
      />
    );
  }
};

export default EditArticlePage;
