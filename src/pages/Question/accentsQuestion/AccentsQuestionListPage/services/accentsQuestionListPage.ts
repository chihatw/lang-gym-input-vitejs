import { useContext, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useHandleQuestionGroups } from '../../../../../services/useQuestionGroups';
import { useHandleQuestions } from '../../../../../services/useQuestions';
import { AppContext } from '../../../../../services/app';
import {
  QuestionSet,
  useHandleQuestionSets,
} from '../../../../../services/useQuestionSets';
import { useHandleQuestionSetScores } from '../../../../../services/useQuestionSetScores';

export const useAccentsQuestionListPage = () => {
  const navigate = useNavigate();

  const { accentsQuestionSets, setQuestionSetId, users, questionGroup } =
    useContext(AppContext);

  const { deleteQuestionSet } = useHandleQuestionSets();
  const { getQuestionGroup, deleteQuestionGroup } = useHandleQuestionGroups();
  const { deleteQuestions } = useHandleQuestions();
  const { deleteQuestionSetScoresByQuestionSetId } =
    useHandleQuestionSetScores();

  const userDisplaynames = useMemo(() => {
    const userDisplayname: { [key: string]: string } = {};
    for (const user of users) {
      userDisplayname[user.id] = user.displayname;
    }
    return userDisplayname;
  }, [users]);

  const onEdit = (q: QuestionSet) => {
    setQuestionSetId(q.id);
    navigate(`/accentsQuestion/${q.id}`);
  };

  const onDelete = async (q: QuestionSet) => {
    const questionGroup = await getQuestionGroup(q.questionGroups[0]);
    if (window.confirm(`${q.title}を削除しますか`)) {
      if (!!questionGroup.id) {
        const result = await deleteQuestions(questionGroup.questions);
        if (!!result) {
          const result = await deleteQuestionGroup(questionGroup.id);
          if (!!result) {
            deleteQuestionSetScoresByQuestionSetId(q.id);

            deleteQuestionSet(q.id);
          }
        }
      } else {
        deleteQuestionSet(q.id);
      }
    }
  };

  return {
    questionSets: accentsQuestionSets,
    userDisplaynames,
    onEdit,
    onDelete,
  };
};
