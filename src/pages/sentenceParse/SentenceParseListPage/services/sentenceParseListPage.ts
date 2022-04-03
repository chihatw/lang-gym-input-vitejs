import { createContext } from 'react';

import { Sentence } from '../../../../entities/Sentence';
import { SentenceParseNew } from '../../../../entities/SentenceParseNew';
import { Article } from '../../../../services/useArticles';

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
