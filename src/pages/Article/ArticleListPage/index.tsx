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

  const { deleteArticle } = useHandleArticles();
  const { deleteSentences } = useHandleSentences();

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

  return <ArticleListPageComponent state={state} dispatch={dispatch} />;
};

export default ArticleListPage;
