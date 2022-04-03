import { Navigate, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { Sentence } from '../../../entities/Sentence';
import { AppContext } from '../../../services/app';
import { getSentences } from '../../../repositories/sentence';
import { SentenceParseNew } from '../../../entities/SentenceParseNew';
import { getSentenceParseNews } from '../../../repositories/sentenceParseNew';
import { Article, useHandleArticles } from '../../../services/useArticles';
import SentenceParseListPageComponent from './components/SentenceParseListPageComponent';
import { SentenceParseListPageContext } from './services/sentenceParseListPage';

const SentenceParseListPage = () => {
  const navigate = useNavigate();
  const { article, isFetching } = useContext(AppContext);

  const { updateArticle } = useHandleArticles();

  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [marks, setMarks] = useState<string[]>(article.marks);
  const [explanationStr, setExplanationStr] = useState('');
  const [sentenceParseNews, setSentenceParseNews] = useState<{
    [id: string]: SentenceParseNew;
  }>({});

  useEffect(() => {
    if (!article.id) return;
    const fetchData = async () => {
      const sentences = await getSentences(article.id);
      if (!!sentences) {
        setSentences(sentences);
      }
    };
    fetchData();
  }, [article]);

  useEffect(() => {
    const newMarks: string[] = [];
    for (let i in sentences) {
      newMarks.push(article.marks[i] || '');
    }
    setMarks(newMarks);
  }, [sentences]);

  useEffect(() => {
    const fetchData = async () => {
      if (!article) return;
      const sentenceParseNews = await getSentenceParseNews(article.id);
      setSentenceParseNews(sentenceParseNews || {});
    };
    fetchData();
  }, [article]);

  const onBatch = () => {
    const lines = explanationStr.split('\n').map((line) => line.split(' ')[0]);
    lines.unshift('');
    setMarks(lines);
  };

  const onSubmit = () => {
    const newArticle: Article = {
      ...article!,
      marks,
    };
    updateArticle(newArticle);
  };
  const onCopy = async (index: number) => {
    const sentence = sentences[index];
    const sentenceParseNew = sentenceParseNews[sentence.id];
    const item: {
      line: number;
      japanese: string;
      chinese: string;
      units: string;
      words: string;
      branches: string;
      sentences: string;
      sentenceArrays: string;
      branchInvisibilities: string;
      commentInvisibilities: string;
    } = {
      line: sentenceParseNew.line + 1,
      japanese: sentence.japanese,
      chinese: sentence.chinese,
      units: JSON.stringify(sentenceParseNew.units),
      words: JSON.stringify(sentenceParseNew.words),
      branches: JSON.stringify(sentenceParseNew.branches),
      sentences: JSON.stringify(sentenceParseNew.sentences),
      sentenceArrays: JSON.stringify(sentenceParseNew.sentenceArrays),
      branchInvisibilities: JSON.stringify(
        sentenceParseNew.branchInvisibilities
      ),
      commentInvisibilities: JSON.stringify(
        sentenceParseNew.commentInvisibilities
      ),
    };
    console.log(JSON.stringify(item));
    await navigator.clipboard.writeText(JSON.stringify(item));
    console.log('copied!!');
  };

  const openEditPage = (sentenceId: string) => {
    navigate(`/sentence/${sentenceId}/parse`);
  };
  if (isFetching) {
    return <></>;
  } else {
    if (article) {
      return (
        <SentenceParseListPageContext.Provider
          value={{
            marks,
            onCopy,
            article,
            onBatch,
            setMarks,
            onSubmit,
            sentences,
            explanationStr,
            sentenceParseNews,
            setExplanationStr,
          }}
        >
          <SentenceParseListPageComponent
            article={article}
            sentences={sentences}
            sentenceParseNews={sentenceParseNews}
            onCopy={onCopy}
            openEditPage={openEditPage}
          />
        </SentenceParseListPageContext.Provider>
      );
    } else {
      return <Navigate to='/article/list' />;
    }
  }
};

export default SentenceParseListPage;
