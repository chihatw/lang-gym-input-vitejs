import React, { useState } from 'react';
import { Button } from '@mui/material';

import TableLayout from '../../../../components/templates/TableLayout';
import SentenceRow from './SentenceRow';
import InitializeSentencesPane from './InitializeSentencesPane';
import {
  Accent,
  INITIAL_QUESTION,
  INITIAL_QUESTION_GROUP,
  INITIAL_QUESTION_SET,
  Question,
  QuestionGroup,
  QuestionSet,
  State,
} from '../../../../Model';
import { Action, ActionTypes } from '../../../../Update';
import {
  createQuiz,
  buildRhythmQuizFromState,
  buildAccentString,
  buildAccentQuizFromState,
} from '../../../../services/quiz';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

const ArticlePageComponent = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  const [isSm, setIsSm] = useState(true);
  const { article, sentences } = state;

  const handleCreateAccentQuiz = async () => {
    const { quiz, questionGroup, questions } = buildAccentQuizFromState(state);
    await createQuiz(quiz, questionGroup, questions);
    dispatch({
      type: ActionTypes.submitQuiz,
      payload: { quiz, questions },
    });
    navigate(`/accentsQuestion/${quiz.id}`);
  };

  const handleCreateRhythmQuiz = async () => {
    const { quiz, questionGroup, questions } = buildRhythmQuizFromState(state);
    await createQuiz(quiz, questionGroup, questions);
    dispatch({
      type: ActionTypes.submitQuiz,
      payload: { quiz, questions },
    });
    navigate(`/rhythmsQuestion/${quiz.id}`);
  };
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

          <Button variant='contained' onClick={handleCreateAccentQuiz}>
            アクセント問題作成
          </Button>
          <Button variant='contained' onClick={handleCreateRhythmQuiz}>
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

const sentences2AccentsQuestions = ({
  sentences,
  questionGroupId,
}: {
  sentences: {
    japanese: string;
    accents: Accent[];
  }[];
  questionGroupId: string;
}): Question[] => {
  return sentences.map(({ japanese, accents }, index) => {
    const question: Question = {
      ...INITIAL_QUESTION,
      id: nanoid(8),
      answers: [buildAccentString(accents)],
      createdAt: new Date().getTime() + index,
      question: JSON.stringify({
        japanese,
        disableds: [],
        audio: { start: 0, end: 0, downloadURL: '' },
        accents,
      }),
      questionGroup: questionGroupId,
      type: 'articleAccents',
    };
    return question;
  });
};
