import { useEffect, useState } from 'react';
import { Article } from '../../../../../entities/Article';
import { Sentence } from '../../../../../entities/Sentence';
import { getArticle } from '../../../../../repositories/article';
import { getSentence } from '../../../../../repositories/sentence';

export const useArticleSentence = (id: string) => {
  const [initializing, setInitializing] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [sentence, setSentence] = useState<Sentence | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const sentence = await getSentence(id);
      if (!!sentence) {
        setSentence(sentence);
      } else {
        setInitializing(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!sentence) return;
    const fetchData = async () => {
      const article = await getArticle(sentence.article);
      if (!!article) {
        setArticle(article);
      }
      setInitializing(false);
    };
    fetchData();
  }, [sentence]);

  return {
    initializing,
    article,
    sentence,
  };
};
