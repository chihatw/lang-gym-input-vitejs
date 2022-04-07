import React from 'react';
import { Button } from '@mui/material';

import TableLayout from '../../../../components/templates/TableLayout';
import SentenceRow from './SentenceRow';
import { Article } from '../../../../services/useArticles';
import { Sentence } from '../../../../entities/Sentence';
import { Assignment } from '../../../../services/useAssignments';
import { SentenceParseNew } from '../../../../services/useSentenceParseNews';
import { AssignmentSentence } from '../../../../services/useAssignmentSentences';
import InitializeSentencesPane from './InitializeSentencesPane';

const ArticlePageComponent = ({
  article,
  sentences,
  assignment,
  sentenceParseNews,
  assignmentSentences,
  openPage,
  copySentenceParseNew,
  createAccentsQuestion,
  createRhythmsQuestion,
}: {
  article: Article;
  sentences: Sentence[];
  assignment: Assignment;
  sentenceParseNews: SentenceParseNew[];
  assignmentSentences: AssignmentSentence[];
  openPage: (path: string) => void;
  copySentenceParseNew: (value: number) => void;
  createAccentsQuestion: () => void;
  createRhythmsQuestion: () => void;
}) => (
  <TableLayout maxWidth='md' title={article.title} backURL={`/article/list`}>
    {!!sentences.length ? (
      <div style={{ display: 'grid', rowGap: 16 }}>
        {sentences.map((sentence, index) => {
          return (
            <SentenceRow
              key={index}
              sentence={sentence}
              downloadURL={article.downloadURL}
              sentenceParseNew={sentenceParseNews[index]}
              openEditParsePage={() => openPage(`/parse/${index}`)}
              assignmentSentence={assignmentSentences[index]}
              assignmentDownloadURL={assignment.downloadURL}
              copySentenceParseNew={() => copySentenceParseNew(index)}
            />
          );
        })}

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
