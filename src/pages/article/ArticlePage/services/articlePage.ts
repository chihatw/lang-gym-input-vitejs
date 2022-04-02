import { createContext, useEffect, useState } from 'react';

import { Article } from '../../../../services/useArticles';
import { Sentence } from '../../../../entities/Sentence';
import { getSentences } from '../../../../repositories/sentence';

export const ArticlePaneContext = createContext<{
  article: Article | null;
  sentences: Sentence[];
}>({ article: null, sentences: [] });

export const useArticlePage = (articleId: string) => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  useEffect(() => {
    if (!articleId) return;
    const fetchData = async () => {
      const sentences = await getSentences(articleId);
      !!sentences && setSentences(sentences);
    };
    fetchData();
  }, [articleId]);

  return { sentences };
};
