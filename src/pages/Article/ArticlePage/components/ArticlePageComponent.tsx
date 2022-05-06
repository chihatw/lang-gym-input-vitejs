import React, { useContext } from 'react';
import { Button } from '@mui/material';

import TableLayout from '../../../../components/templates/TableLayout';
import SentenceRow from './SentenceRow';
import InitializeSentencesPane from './InitializeSentencesPane';
import { AppContext } from '../../../../services/app';

const ArticlePageComponent = ({
  isSm,
  openPage,
  copySentenceParseNew,
  createAccentsQuestion,
  createRhythmsQuestion,
  handleClickWidthButton,
}: {
  isSm: boolean;
  openPage: (path: string) => void;
  copySentenceParseNew: (value: number) => void;
  createAccentsQuestion: () => void;
  createRhythmsQuestion: () => void;
  handleClickWidthButton: () => void;
}) => {
  const {
    article,
    sentences,
    assignment,
    sentenceParseNews,
    assignmentSentences,
    setSentenceId,
  } = useContext(AppContext);
  return (
    <TableLayout
      maxWidth={isSm ? 'sm' : 'md'}
      title={article.title}
      backURL={`/article/list`}
    >
      <div style={{ marginBottom: 16 }}>
        <Button
          size='small'
          variant='contained'
          onClick={handleClickWidthButton}
        >
          switch width
        </Button>
      </div>
      {!!sentences.length ? (
        <div style={{ display: 'grid', rowGap: 16 }}>
          {sentences.map((sentence, index) => (
            <SentenceRow
              key={index}
              isSm={isSm}
              sentence={sentence}
              downloadURL={article.downloadURL}
              sentenceParseNew={sentenceParseNews[index]}
              openEditParsePage={() => {
                setSentenceId(sentence.id);
                setTimeout(() => {
                  openPage(`/parse/${index}`);
                }, 100);
              }}
              openEditArticleSentenceFormPane={() => {
                setTimeout(() => {
                  openPage(`/form/${index}`);
                }, 100);
              }}
              assignmentSentence={assignmentSentences[index]}
              assignmentDownloadURL={assignment.downloadURL}
              copySentenceParseNew={() => copySentenceParseNew(index)}
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
