import { useEffect, useState } from 'react';
import { getUser } from '../../../../../repositories/user';
import { useHistory } from 'react-router-dom';
import { db } from '../../../../../repositories/firebase';
import {
  buildQuestionSet,
  QuestionSet,
} from '../../../../../entities/QuestionSet';
import {
  deleteQuestionGroup,
  getQuestionGroup,
} from '../../../../../repositories/questionGroup';
import { deleteQuestions } from '../../../../../repositories/question';
import { deleteQuestionSetScoresByQuestionSetID } from '../../../../../repositories/questionSetScore';
import { deleteQuestionSet } from '../../../../../repositories/questionSet';

export const useRhythmsQuestionListPage = () => {
  const history = useHistory();
  const [uids, setUids] = useState<string[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [userDisplaynames, setUserDisplaynames] = useState<{
    [id: string]: string;
  }>({});
  useEffect(() => {
    const unsubscribe = db
      .collection('questionSets')
      .where('type', '==', 'articleRhythms')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .onSnapshot(
        (snapshot) => {
          console.log('snapshot question set');
          if (!snapshot.empty) {
            const questionSets = snapshot.docs.map((doc) =>
              buildQuestionSet(doc.id, doc.data())
            );
            setQuestionSets(questionSets);
            setUids(
              questionSets
                .map((q) => q.uid)
                .filter((item, index, self) => self.indexOf(item) === index)
            );
          }
        },
        (error) => {
          console.warn(error);
        }
      );

    return () => {
      unsubscribe();
    };
  }, [history]);

  useEffect(() => {
    if (!uids.length) return;
    const fetchData = async () => {
      const displaynames: { [uid: string]: string } = {};
      await Promise.all(
        uids.map(async (uid) => {
          const user = await getUser(uid);
          displaynames[uid] = !!user ? user.displayname : '';
        })
      );
      setUserDisplaynames(displaynames);
    };

    fetchData();
    // eslint-disable-next-line
  }, [uids]);

  const onEdit = (q: QuestionSet) => {
    history.push(`/rhythmsQuestion/${q.id}`);
  };

  const onDelete = (q: QuestionSet) => async () => {
    if (window.confirm(`${q.title}を削除しますか`)) {
      const questionGroup = await getQuestionGroup(q.questionGroups[0]);
      if (!!questionGroup) {
        const { success } = await deleteQuestions(questionGroup.questions);
        if (success) {
          const { success } = await deleteQuestionGroup(questionGroup.id);
          if (success) {
            await deleteQuestionSetScoresByQuestionSetID(q.id);
            await deleteQuestionSet(q.id);
          }
        }
      } else {
        await deleteQuestionSet(q.id);
      }
    }
  };

  return { questionSets, userDisplaynames, onEdit, onDelete };
};
