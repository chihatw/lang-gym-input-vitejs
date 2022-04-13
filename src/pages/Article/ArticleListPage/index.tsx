import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

import { AppContext } from '../../../services/app';
import { deleteFile } from '../../../repositories/file';
import { useHandleSentences } from '../../../services/useSentences';
import ArticleListPageComponent from './components/ArticleListPageComponent';
import { Article, useHandleArticles } from '../../../services/useArticles';

const ArticleListPage = () => {
  const navigate = useNavigate();
  const { articles, setArticleId } = useContext(AppContext);
  const { updateArticle, deleteArticle } = useHandleArticles();
  const { deleteSentences } = useHandleSentences();

  const handleClickShowAccents = (article: Article) => {
    updateArticle({
      ...article,
      isShowAccents: !article.isShowAccents,
    });
  };

  const handleClickShowParses = (article: Article) => {
    updateArticle({
      ...article,
      isShowParse: !article.isShowParse,
    });
  };

  const handleClickShowRecButton = (article: Article) => {
    updateArticle({
      ...article,
      hasRecButton: !article.hasRecButton,
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
        deleteFile(path);
      }
      await deleteSentences(id);
      await deleteArticle(id);
    }
  };

  const openPage = ({
    path,
    article: _article,
  }: {
    path: string;
    article: Article;
  }) => {
    setArticleId(_article.id);
    navigate(`/article`);
  };

  const handleClickOpenCreateArticlePage = () => {
    setArticleId('');
    setTimeout(() => navigate('/article'), 100);
  };

  return (
    <ArticleListPageComponent
      articles={articles}
      openPage={openPage}
      handleClickDelete={handleClickDelete}
      handleClickShowAccents={handleClickShowAccents}
      handleClickShowParses={handleClickShowParses}
      handleClickShowRecButton={handleClickShowRecButton}
      handleClickOpenCreateArticlePage={handleClickOpenCreateArticlePage}
    />
  );
};

export default ArticleListPage;
