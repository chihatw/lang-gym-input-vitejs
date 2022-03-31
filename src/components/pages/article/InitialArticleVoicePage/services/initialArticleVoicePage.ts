import { getDownloadURL } from '@firebase/storage';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Article } from '../../../../../entities/Article';
import { getArticle, updateArticle } from '../../../../../repositories/article';
import { uploadFile } from '../../../../../repositories/file';
import { getSentences } from '../../../../../repositories/sentence';

export const useInitialArticleVoicePage = (id: string) => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [hasSentences, setHasSentences] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const article = await getArticle(id);
      console.log(article);
      setTitle(article?.title || '');
      setArticle(article);

      const sentences = await getSentences(id);
      if (!!sentences) {
        setHasSentences(!!sentences.length);
      }
      setInitializing(false);
    };
    fetchData();
  }, [id]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'ondokus');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const newArticle: Article = {
        ...article!,
        downloadURL: url,
      };
      const { success } = await updateArticle(newArticle);
      if (success) {
        history.push(`/article/${id}/voice`);
      }
    }
  };

  return { title, initializing, onUpload, hasSentences };
};
