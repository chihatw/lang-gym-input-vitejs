import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useHandleQuestionGroups } from '../../../../../services/useQuestionGroups';
import { useHandleQuestions } from '../../../../../services/useQuestions';
import {
  QuestionSet,
  useHandleQuestionSets,
} from '../../../../../services/useQuestionSets';
import { AppContext } from '../../../../../services/app';
import { useHandleQuestionSetScores } from '../../../../../services/useQuestionSetScores';

export const useRhythmsQuestionListPage = () => {
  const navigate = useNavigate();

  const { rhythmsQuestionSets, setQuestionSetId } = useContext(AppContext);

  const { deleteQuestionSet } = useHandleQuestionSets();
  const { deleteQuestionGroup, getQuestionGroup } = useHandleQuestionGroups();
  const { deleteQuestions } = useHandleQuestions();
  const { deleteQuestionSetScoresByQuestionSetId } =
    useHandleQuestionSetScores();

  // const userDisplaynames = useMemo(() => {
  //   const userDisplaynames: { [key: string]: string } = {};
  //   for (const user of users) {
  //     userDisplaynames[user.id] = user.displayname;
  //   }

  //   return userDisplaynames;
  // }, [users]);

  const onEdit = (q: QuestionSet) => {
    setQuestionSetId(q.id);
    navigate(`/rhythmsQuestion/${q.id}`);
  };

  const onDelete = async (q: QuestionSet) => {
    if (window.confirm(`${q.title}を削除しますか`)) {
      const questionGroup = await getQuestionGroup(q.questionGroups[0]);
      if (!!questionGroup) {
        const result = await deleteQuestions(questionGroup.questions);
        if (!!result) {
          const result = await deleteQuestionGroup(questionGroup.id);
          if (!!result) {
            await deleteQuestionSetScoresByQuestionSetId(q.id);
            deleteQuestionSet(q.id);
          }
        }
      } else {
        deleteQuestionSet(q.id);
      }
    }
  };

  return {
    questionSets: rhythmsQuestionSets,
    onEdit,
    onDelete,
  };
};
