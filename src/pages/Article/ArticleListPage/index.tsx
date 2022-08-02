import React, { useEffect } from 'react';
import { deleteFile } from '../../../repositories/file';
import { useHandleSentences } from '../../../services/useSentences';
import ArticleListPageComponent from './components/ArticleListPageComponent';
import { useHandleArticles } from '../../../services/useArticles';
import { Article, State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getArticles } from '../../../services/article';

const ArticleListPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { isFetching, articleList } = state;
  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      const _articleList = !!articleList.length
        ? articleList
        : await getArticles();
      dispatch({ type: ActionTypes.setArticleList, payload: _articleList });
    };
    fetchData();
  }, [isFetching]);

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

  // debug
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

  return (
    <ArticleListPageComponent
      state={state}
      dispatch={dispatch}
      handleClickDelete={handleClickDelete}
      handleClickShowAccents={handleClickShowAccents}
      handleClickShowParses={handleClickShowParses}
      handleClickShowRecButton={handleClickShowRecButton}
    />
  );
};

export default ArticleListPage;
