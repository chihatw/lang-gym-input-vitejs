import { createContext, useEffect, useState } from 'react';
import { Article } from '../../../../../entities/Article';
import { Sentence } from '../../../../../entities/Sentence';
import { SentenceParseNew } from '../../../../../entities/SentenceParseNew';
import { getArticle, updateArticle } from '../../../../../repositories/article';
import { getSentences } from '../../../../../repositories/sentence';
import { getSentenceParseNews } from '../../../../../repositories/sentenceParseNew';

export const SentenceParseListPageContext = createContext<{
  marks: string[];
  onCopy: (index: number) => void;
  article: Article | null;
  onBatch: () => void;
  setMarks: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: () => void;
  sentences: Sentence[];
  explanationStr: string;
  sentenceParseNews: {
    [id: string]: SentenceParseNew;
  };
  setExplanationStr: React.Dispatch<React.SetStateAction<string>>;
}>({
  marks: [],
  onCopy: () => {},
  article: null,
  onBatch: () => {},
  onSubmit: () => {},
  setMarks: () => {},
  sentences: [],
  explanationStr: '',
  setExplanationStr: () => {},
  sentenceParseNews: {},
});

export const useSentenceParseListPage = (id: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [initializing, setInitializing] = useState(true);
  const [marks, setMarks] = useState<string[]>([]);
  const [explanationStr, setExplanationStr] = useState('');
  const [sentenceParseNews, setSentenceParseNews] = useState<{
    [id: string]: SentenceParseNew;
  }>({});

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const article = await getArticle(id);
      if (!!article) {
        setMarks(article.marks);
        setArticle(article);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!article) return;
    const fetchData = async () => {
      const sentences = await getSentences(article.id);
      if (!!sentences) {
        setSentences(sentences);
        const newMarks: string[] = [];
        for (let i in sentences) {
          newMarks.push(marks[i] || '');
        }
        setMarks(newMarks);
      }
      setInitializing(false);
    };
    fetchData();
    // marksの変更は無視する
    // eslint-disable-next-line
  }, [article, id]);

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

  return {
    article,
    sentences,
    initializing,
    marks,
    setMarks,
    onSubmit,
    onBatch,
    onCopy,
    explanationStr,
    setExplanationStr,
    sentenceParseNews,
  };
};
