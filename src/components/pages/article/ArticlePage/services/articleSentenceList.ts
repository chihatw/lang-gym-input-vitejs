import { useContext } from 'react';
import { useHistory } from 'react-router';
import { buildAccentString } from '../../../../../entities/Accent';
import { CreateQuestion } from '../../../../../entities/Question';
import {
  CreateQuestionGroup,
  QuestionGroup,
} from '../../../../../entities/QuestionGroup';
import { CreateQuestionSet } from '../../../../../entities/QuestionSet';
import { createQuestions } from '../../../../../repositories/question';
import {
  createQuestionGroup,
  updateQuestionGroup,
} from '../../../../../repositories/questionGroup';
import { createQuestionSet } from '../../../../../repositories/questionSet';
import { ArticlePaneContext } from './articlePage';

export const useArticleSentenceList = () => {
  const history = useHistory();
  const { article, sentences } = useContext(ArticlePaneContext);
  const onEdit = (sentenceID: string) => {
    history.push(`/sentence/${sentenceID}`);
  };
  const onEditParse = (sentenceID: string) => {
    history.push(`/sentence/${sentenceID}/parse`);
  };

  const onCreateAccentsQuestion = async () => {
    if (!article) return;
    const questionGroup: CreateQuestionGroup = {
      createdAt: new Date().getTime(),
      example: '',
      explanation: '',
      feedback: '',
      hasFreeAnswers: false,
      questions: [],
      tags: {},
    };

    const { success, questionGroupID } = await createQuestionGroup(
      questionGroup
    );

    if (success) {
      const questions: CreateQuestion[] = sentences.map((s, index) => ({
        answerExample: '',
        answers: [buildAccentString(s.accents)],
        choices: [],
        createdAt: new Date().getTime() + index,
        feedback: '',
        memo: '',
        note: '',
        question: JSON.stringify({
          japanese: s.japanese,
          disableds: [],
          audio: { start: 0, end: 0, downloadURL: '' },
          accents: s.accents,
        }),
        questionGroup: questionGroupID!,
        tags: {},
        type: 'articleAccents',
      }));

      const docIDs = await createQuestions(questions);
      if (!!docIDs.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          id: questionGroupID!,
          questions: docIDs,
        };
        const { success } = await updateQuestionGroup(updatedQuestionGroup);
        if (success) {
          let questionCount = 0;
          sentences.forEach((s) => {
            const accents = s.accents;
            questionCount += accents.length;
          });
          const questionSet: CreateQuestionSet = {
            answered: false,
            createdAt: new Date().getTime(),
            hasFreeAnswers: false,
            questionCount,
            questionGroups: [questionGroupID!],
            title: `${article.title} - アクセント`,
            type: 'articleAccents',
            uid: import.meta.env.VITE_ADMIN_UID,
            unlockedAt: new Date().getTime(),
            userDisplayname: '原田',
          };
          const { success, questionSetID } = await createQuestionSet(
            questionSet
          );
          if (success) {
            history.push(`/accentsQuestion/${questionSetID}`);
          }
        }
      }
    }
  };
  return {
    onEdit,
    onEditParse,
    onCreateAccentsQuestion,
  };
};
