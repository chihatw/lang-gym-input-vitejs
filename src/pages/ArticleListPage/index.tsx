import React, { useContext } from 'react';

import { AppContext } from '../../services/app';
import { deleteFile } from '../../repositories/file';
import { deleteSentences } from '../../repositories/sentence';
import { Article, useHandleArticles } from '../../services/useArticles';
import ArticleListPageComponent from './components/ArticleListPageComponent';
import { useNavigate } from 'react-router-dom';

// TODO article に hasRecButton を追加

const ArticleListPage = () => {
  const navigate = useNavigate();
  const { articles, setArticleId, setIsFetching } = useContext(AppContext);
  const { updateArticle, deleteArticle } = useHandleArticles();

  const handleClickShowAccents = async (article: Article) => {
    await updateArticle({
      ...article,
      isShowAccents: !article.isShowAccents,
    });
  };

  const handleClickShowParses = async (article: Article) => {
    await updateArticle({
      ...article,
      isShowParse: !article.isShowParse,
    });
  };

  const handleClickDelete = async ({
    id,
    title,
    downloadURL,
  }: {
    id: string;
    title: string;
    downloadURL: string;
  }) => {
    if (window.confirm(`${title}を削除しますか`)) {
      if (downloadURL) {
        const path = decodeURIComponent(
          downloadURL.split('/')[7].split('?')[0]
        );
        await deleteFile(path);
      }
      await deleteSentences(id);
      await deleteArticle(id);
    }
  };

  const openPage = ({ path, article }: { path: string; article: Article }) => {
    console.log('!');
    setIsFetching(true);
    setArticleId(article.id);
    navigate(`/article/${path}`);
  };

  const links = [
    { label: '戻る', pathname: '/' },
    { label: '新規作成', pathname: '/article' },
  ];

  return (
    <ArticleListPageComponent
      links={links}
      articles={articles}
      openPage={openPage}
      handleClickDelete={handleClickDelete}
      handleClickShowAccents={handleClickShowAccents}
      handleClickShowParses={handleClickShowParses}
    />
  );
};

export default ArticleListPage;
