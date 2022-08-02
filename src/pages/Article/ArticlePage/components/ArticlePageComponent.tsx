import React, { useState } from 'react';
import { Button } from '@mui/material';

import TableLayout from '../../../../components/templates/TableLayout';
import SentenceRow from './SentenceRow';
import InitializeSentencesPane from './InitializeSentencesPane';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';

const ArticlePageComponent = ({
  state,
  dispatch,
  createAccentsQuestion,
  createRhythmsQuestion,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  createAccentsQuestion: () => void;
  createRhythmsQuestion: () => void;
}) => {
  const [isSm, setIsSm] = useState(true);
  const { article, sentences } = state;
  return (
    <TableLayout
      maxWidth={isSm ? 'sm' : 'md'}
      title={article.title}
      backURL={`/article/list`}
    >
      <div style={{ marginBottom: 16 }}>
        <Button size='small' variant='contained' onClick={() => setIsSm(!isSm)}>
          switch width
        </Button>
      </div>
      {!!sentences.length ? (
        <div style={{ display: 'grid', rowGap: 16 }}>
          {sentences.map((_, sentenceIndex) => (
            <SentenceRow
              key={sentenceIndex}
              isSm={isSm}
              state={state}
              sentenceIndex={sentenceIndex}
              dispatch={dispatch}
            />
          ))}

          <Button variant='contained' onClick={createAccentsQuestion}>
            アクセント問題作成
          </Button>
          <Button variant='contained' onClick={createRhythmsQuestion}>
            リズム問題作成
          </Button>
        </div>
      ) : (
        <InitializeSentencesPane article={article} />
      )}
    </TableLayout>
  );
};

export default ArticlePageComponent;
