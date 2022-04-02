import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  limit,
} from '@firebase/firestore';

import { useEffect, useState } from 'react';
import { getUser } from '../../../../repositories/user';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../../repositories/firebase';
import {
  buildQuestionSet,
  QuestionSet,
} from '../../../../entities/QuestionSet';
import {
  deleteQuestionGroup,
  getQuestionGroup,
} from '../../../../repositories/questionGroup';
import { deleteQuestions } from '../../../../repositories/question';
import { deleteQuestionSetScoresByQuestionSetID } from '../../../../repositories/questionSetScore';
import { deleteQuestionSet } from '../../../../repositories/questionSet';

const LIMIT = 5;
const COLLECTION = 'questionSets';
const colRef = collection(db, COLLECTION);

export const useAccentsQuestionListPage = () => {
  const navigate = useNavigate();
  const [uids, setUids] = useState<string[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [userDisplaynames, setUserDisplaynames] = useState<{
    [id: string]: string;
  }>({});
  useEffect(() => {
    const q = query(
      colRef,
      where('type', '==', 'articleAccents'),
      orderBy('createdAt', 'desc'),
      limit(LIMIT)
    );
    const unsubscribe = onSnapshot(
      q,
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
      (e) => {
        console.warn(e);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [navigate]);

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
    navigate(`/accentsQuestion/${q.id}`);
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
