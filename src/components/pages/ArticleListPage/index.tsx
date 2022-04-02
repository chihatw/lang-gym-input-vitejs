import React, { useContext } from 'react';

import { AppContext } from '../../../services/app';
import { deleteFile } from '../../../repositories/file';
import { deleteSentences } from '../../../repositories/sentence';
import { Article, useHandleArticles } from '../../../services/useArticles';
import ArticleListPageComponent from './components/ArticleListPageComponent';

// TODO article に hasRecButton を追加

const ArticleListPage = () => {
  const { articles } = useContext(AppContext);
  const { updateArticle, deleteArticle } = useHandleArticles();

  const onToggleShowAccents = async (article: Article) => {
    await updateArticle({
      ...article,
      isShowAccents: !article.isShowAccents,
    });
  };

  const onToggleShowParse = async (article: Article) => {
    await updateArticle({
      ...article,
      isShowParse: !article.isShowParse,
    });
  };

  const onDelete = async ({
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

  const links = [
    { label: '戻る', pathname: '/' },
    { label: '新規作成', pathname: '/article' },
  ];

  return (
    <ArticleListPageComponent
      links={links}
      articles={articles}
      handleClickDelete={onDelete}
      handleClickShowAccents={onToggleShowAccents}
      handleClickShowSentenceParses={onToggleShowParse}
    />
  );
};

export default ArticleListPage;
