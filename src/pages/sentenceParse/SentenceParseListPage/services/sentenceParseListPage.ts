import { createContext } from 'react';

import { Sentence } from '../../../../entities/Sentence';

import { Article } from '../../../../services/useArticles';
import { SentenceParseNew } from '../../../../services/useSentenceParseNews';

export const SentenceParseListPageContext = createContext<{
  marks: string[];
  onCopy: (index: number) => void;
  article: Article | null;
  setMarks: React.Dispatch<React.SetStateAction<string[]>>;
  sentences: Sentence[];
  sentenceParseNews: {
    [id: string]: SentenceParseNew;
  };
}>({
  marks: [],
  onCopy: () => {},
  article: null,
  setMarks: () => {},
  sentences: [],
  sentenceParseNews: {},
});
