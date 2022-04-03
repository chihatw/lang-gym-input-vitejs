import { useNavigate } from 'react-router-dom';
import { getDownloadURL } from '@firebase/storage';
import { useEffect, useState } from 'react';

import { uploadFile } from '../../../../repositories/file';
import { getSentences } from '../../../../repositories/sentence';
import { Article, useHandleArticles } from '../../../../services/useArticles';

export const useInitialArticleVoicePage = ({
  article,
}: {
  article: Article;
}) => {
  const navigate = useNavigate();
  const { updateArticle } = useHandleArticles();
  const [hasSentences, setHasSentences] = useState(false);

  useEffect(() => {
    if (!article.id) return;
    const fetchData = async () => {
      const sentences = await getSentences(article.id);
      if (!!sentences) {
        setHasSentences(!!sentences.length);
      }
    };
    fetchData();
  }, [article]);

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
        navigate(`/article/${article.id}/voice`);
      }
    }
  };

  return { onUpload, hasSentences };
};
