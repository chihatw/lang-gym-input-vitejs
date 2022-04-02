import { createContext, useEffect, useState } from 'react';

import { Sentence } from '../../../../entities/Sentence';
import { getArticle } from '../../../../repositories/article';
import { getSentences } from '../../../../repositories/sentence';
import { Article } from '../../../../services/useArticles';

export const ArticlePaneContext = createContext<{
  article: Article | null;
  sentences: Sentence[];
}>({ article: null, sentences: [] });

export const useArticlePage = (id: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const article = await getArticle(id);
      if (!!article) {
        setArticle(article);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!article) return;
    const fetchData = async () => {
      const sentences = await getSentences(article.id);
      !!sentences && setSentences(sentences);
      setInitializing(false);
    };
    fetchData();
  }, [article, id]);

  return {
    article,
    sentences,
    initializing,
  };
};
