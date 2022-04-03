import { useNavigate } from 'react-router-dom';
import { getDownloadURL } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';

import { Mark } from '../../../entities/Mark';
import { Sentence } from '../../../entities/Sentence';
import { AppContext } from '../../../services/app';
import { deleteFile, uploadFile } from '../../../repositories/file';
import EditArticleVoicePageComponent from './components/EditArticleVoicePageComponent';
import { Article, useHandleArticles } from '../../../services/useArticles';
import { getSentences, updateSentences } from '../../../repositories/sentence';

const EditArticleVoicePage = () => {
  const navigate = useNavigate();
  const { article, isFetching } = useContext(AppContext);
  const { updateArticle } = useHandleArticles();

  const [marks, setMarks] = useState<Mark[]>([]);
  const [sentences, setSentences] = useState<string[]>([]);
  const [originalMarks, setOriginalMarks] = useState<Mark[]>([]);
  const [originalSentences, setOriginalSentences] = useState<Sentence[]>([]);
  const [hasChange, setHasChange] = useState(false);

  useEffect(() => {
    if (!article.id) return;
    const fetchData = async () => {
      const articleSentences = await getSentences(article.id);
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
      navigate(`/article/${article.id}`);
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'articles');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const newArticle: Article = {
        ...article!,
        downloadURL: url,
      };
      updateArticle(newArticle);
    }
  };
  if (isFetching) {
    return <></>;
  } else {
    return (
      <EditArticleVoicePageComponent
        marks={marks}
        article={article}
        sentences={sentences}
        hasChange={hasChange}
        onUpload={onUpload}
        onSubmit={onSubmit}
        onChangeMarks={onChangeMarks}
        onDeleteAudio={onDeleteAudio}
      />
    );
  }
};

export default EditArticleVoicePage;
