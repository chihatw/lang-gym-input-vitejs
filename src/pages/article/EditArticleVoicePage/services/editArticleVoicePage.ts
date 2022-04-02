import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Mark } from '../../../../entities/Mark';
import { Sentence } from '../../../../entities/Sentence';
import { getArticle } from '../../../../repositories/article';

import { deleteFile } from '../../../../repositories/file';
import {
  getSentences,
  updateSentences,
} from '../../../../repositories/sentence';
import { Article, useHandleArticles } from '../../../../services/useArticles';

export const useEditArticleVoicePage = ({
  id,
  article,
}: {
  id: string;
  article: Article;
}) => {
  const navigate = useNavigate();
  const { updateArticle } = useHandleArticles();

  const [marks, setMarks] = useState<Mark[]>([]);
  const [sentences, setSentences] = useState<string[]>([]);
  const [originalMarks, setOriginalMarks] = useState<Mark[]>([]);
  const [originalSentences, setOriginalSentences] = useState<Sentence[]>([]);
  const [hasChange, setHasChange] = useState(false);

  useEffect(() => {
    if (!article.id) return;
    const fetchData = async () => {
      const articleSentences = await getSentences(id);
      if (articleSentences) {
        setMarks(articleSentences.map((s) => ({ start: s.start, end: s.end })));
        setSentences(articleSentences.map((s) => s.japanese));
        setOriginalMarks(
          articleSentences.map((s) => ({ start: s.start, end: s.end }))
        );
        setOriginalSentences(articleSentences);
      }
    };
    fetchData();
  }, [article.id]);

  useEffect(() => {
    setHasChange(JSON.stringify(marks) !== JSON.stringify(originalMarks));
  }, [originalMarks, marks]);

  const onDeleteAudio = async () => {
    if (window.confirm('audioファイルを削除しますか')) {
      const path = decodeURIComponent(
        article.downloadURL.split('/')[7].split('?')[0]
      );
      const { success } = await deleteFile(path);
      if (success) {
        const sentences: Sentence[] = originalSentences.map((s) => ({
          ...s,
          start: 0,
          end: 0,
        }));
        const { success } = await updateSentences(sentences);
        if (success) {
          const newArticle: Article = { ...article, downloadURL: '' };
          const { success } = await updateArticle(newArticle);
          if (success) {
            navigate('/article/list');
          }
        }
      }
    }
  };

  const onChangeMarks = (marks: Mark[]) => {
    setMarks(marks);
  };

  const onSubmit = async () => {
    const sentences: Sentence[] = originalSentences.map((s, index) => ({
      ...s,
      start: marks[index].start,
      end: marks[index].end,
    }));
    const { success } = await updateSentences(sentences);
    if (success) {
      navigate(`article/${id}`);
    }
  };

  return {
    marks,
    hasChange,
    sentences,
    onSubmit,
    onDeleteAudio,
    onChangeMarks,
  };
};
