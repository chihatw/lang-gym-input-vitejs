import React from 'react';
import { Button } from '@mui/material';

import { Article } from '../../../../services/useArticles';
import SentenceRow from './SentenceRow';
import { Sentence } from '../../../../entities/Sentence';

const ArticleSentenceList = ({
  article,
  sentences,
  openPage,
  onCreateAccentsQuestion,
  onCreateRhythmsQuestion,
}: {
  article: Article;
  sentences: Sentence[];
  openPage: ({ path, sentence }: { path: string; sentence: Sentence }) => void;
  onCreateAccentsQuestion: () => void;
  onCreateRhythmsQuestion: () => void;
}) => {
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {sentences.map((sentence, index) => (
          <SentenceRow
            key={index}
            sentence={sentence}
            downloadURL={article.downloadURL}
            openEditPage={() => openPage({ path: `${sentence.id}`, sentence })}
            openEditParsePage={() =>
              openPage({ path: `${sentence.id}/parse`, sentence })
            }
          />
        ))}
      </div>

      <Button variant='contained' onClick={onCreateAccentsQuestion}>
        アクセント問題作成
      </Button>
      <Button variant='contained' onClick={onCreateRhythmsQuestion}>
        リズム問題作成
      </Button>
    </div>
  );
};

export default ArticleSentenceList;
