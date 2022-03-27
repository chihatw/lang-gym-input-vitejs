import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Article, buildArticle } from '../../../../../entities/Article';
import {
  deleteArticle,
  updateArticle,
} from '../../../../../repositories/article';
import { deleteFile } from '../../../../../repositories/file';
import { db } from '../../../../../repositories/firebase';
import { deleteSentences } from '../../../../../repositories/sentence';

export const useArticleListPage = (limit: number) => {
  const history = useHistory();
  const articlesRef = db.collection('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    const unsubscribe = articlesRef
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .onSnapshot((snapshot) => {
        console.log('snapshot article');
        const articles = snapshot.docs.map((doc) =>
          buildArticle(doc.id, doc.data())
        );
        setArticles(articles);
      });

    return () => {
      unsubscribe();
    };
    // articlesRefをdependanciesに加えるとループする
    // eslint-disable-next-line
  }, [limit, history]);

  const onEdit = (articleID: string) => {
    history.push(`/article/${articleID}/edit`);
  };
  const onClickSentences = (articleID: string) => {
    history.push(`/article/${articleID}`);
  };
  const onClickSentenceParse = (articleID: string) => {
    history.push(`/article/${articleID}/parse`);
  };
  const onClickVoice = (articleID: string) => {
    history.push(`/article/${articleID}/voice`);
  };
  const onClickAssignment = (articleID: string) => {
    history.push(`/article/${articleID}/assignment`);
  };
  const onToggleShowAccents = async (article: Article) => {
    const newArticle: Article = {
      ...article,
      isShowAccents: !article.isShowAccents,
    };
    await updateArticle(newArticle);
  };
  const onToggleShowParse = async (article: Article) => {
    const newArticle: Article = {
      ...article,
      isShowParse: !article.isShowParse,
    };
    await updateArticle(newArticle);
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

  return {
    articles,
    history,
    onEdit,
    onDelete,
    onClickVoice,
    onClickSentences,
    onClickAssignment,
    onToggleShowAccents,
    onToggleShowParse,
    onClickSentenceParse,
  };
};
