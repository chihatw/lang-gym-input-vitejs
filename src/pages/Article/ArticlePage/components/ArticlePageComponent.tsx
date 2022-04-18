import React from 'react';
import { Button } from '@mui/material';

import TableLayout from '../../../../components/templates/TableLayout';
import SentenceRow from './SentenceRow';
import { Article } from '../../../../services/useArticles';
import { Assignment } from '../../../../services/useAssignments';
import { SentenceParseNew } from '../../../../services/useSentenceParseNews';
import { AssignmentSentence } from '../../../../services/useAssignmentSentences';
import InitializeSentencesPane from './InitializeSentencesPane';
import { Sentence } from '../../../../services/useSentences';

const ArticlePageComponent = ({
  isSm,
  article,
  sentences,
  assignment,
  sentenceParseNews,
  assignmentSentences,
  openPage,
  setSentenceId,
  copySentenceParseNew,
  createAccentsQuestion,
  createRhythmsQuestion,
  handleClickWidthButton,
}: {
  isSm: boolean;
  article: Article;
  sentences: Sentence[];
  assignment: Assignment;
  sentenceParseNews: SentenceParseNew[];
  assignmentSentences: AssignmentSentence[];
  openPage: (path: string) => void;
  setSentenceId: (value: string) => void;
  copySentenceParseNew: (value: number) => void;
  createAccentsQuestion: () => void;
  createRhythmsQuestion: () => void;
  handleClickWidthButton: () => void;
}) => (
  <TableLayout
    maxWidth={isSm ? 'sm' : 'md'}
    title={article.title}
    backURL={`/article/list`}
  >
    <div style={{ marginBottom: 16 }}>
      <Button size='small' variant='contained' onClick={handleClickWidthButton}>
        switch width
      </Button>
    </div>
    {!!sentences.length ? (
      <div style={{ display: 'grid', rowGap: 16 }}>
        {sentences.map((sentence, index) => (
          <SentenceRow
            key={index}
            sentence={sentence}
            downloadURL={article.downloadURL}
            sentenceParseNew={sentenceParseNews[index]}
            openEditParsePage={() => {
              setSentenceId(sentence.id);
              setTimeout(() => {
                openPage(`/parse/${index}`);
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

export default ArticlePageComponent;
