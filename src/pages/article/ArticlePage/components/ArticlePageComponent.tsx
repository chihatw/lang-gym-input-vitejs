import React from 'react';
import { Button } from '@mui/material';

import TableLayout from '../../../../components/templates/TableLayout';
import SentenceRow from './SentenceRow';
import { Article } from '../../../../services/useArticles';
import { Sentence } from '../../../../entities/Sentence';

const ArticlePageComponent = ({
  article,
  openPage,
  sentences,
  createAccentsQuestion,
  createRhythmsQuestion,
}: {
  article: Article;
  sentences: Sentence[];
  openPage: ({ path, sentence }: { path: string; sentence: Sentence }) => void;
  createAccentsQuestion: () => void;
  createRhythmsQuestion: () => void;
}) => (
  <TableLayout title={article.title} backURL={`/article/list`}>
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {sentences.map((sentence, index) => (
          <SentenceRow
            key={index}
            sentence={sentence}
            downloadURL={article.downloadURL}
            openEditParsePage={() =>
              openPage({ path: `${sentence.id}/parse`, sentence })
            }
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
