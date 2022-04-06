import React from 'react';
import { Button } from '@mui/material';

import TableLayout from '../../../../components/templates/TableLayout';
import SentenceRow from './SentenceRow';
import { Article } from '../../../../services/useArticles';
import { Sentence } from '../../../../entities/Sentence';
import { SentenceParseNew } from '../../../../services/useSentenceParseNews';

const ArticlePageComponent = ({
  article,
  sentences,
  sentenceParseNews,
  openPage,
  copySentenceParseNew,
  createAccentsQuestion,
  createRhythmsQuestion,
}: {
  article: Article;
  sentences: Sentence[];
  sentenceParseNews: SentenceParseNew[];
  openPage: ({ path, sentence }: { path: string; sentence: Sentence }) => void;
  copySentenceParseNew: (value: number) => void;
  createAccentsQuestion: () => void;
  createRhythmsQuestion: () => void;
}) => (
  <TableLayout maxWidth='md' title={article.title} backURL={`/article/list`}>
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {sentences.map((sentence, index) => (
          <SentenceRow
            key={index}
            sentence={sentence}
            downloadURL={article.downloadURL}
            sentenceParseNew={sentenceParseNews[index]}
            openEditParsePage={() =>
              openPage({ path: `${sentence.id}/parse`, sentence })
            }
            copySentenceParseNew={() => copySentenceParseNew(index)}
          />
        ))}
      </div>

      <Button variant='contained' onClick={createAccentsQuestion}>
        アクセント問題作成
      </Button>
      <Button variant='contained' onClick={createRhythmsQuestion}>
        リズム問題作成
      </Button>
    </div>
  </TableLayout>
);

export default ArticlePageComponent;
