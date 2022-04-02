import { useEffect, useState } from 'react';
import { buildAccents, buildAccentString } from '../../../../entities/Accent';
import { Audio } from '../../../../entities/Audio';
import { QuestionSet } from '../../../../entities/QuestionSet';

import {
  getQuestion,
  updateQuestions,
} from '../../../../repositories/question';
import { getQuestionGroup } from '../../../../repositories/questionGroup';
import {
  getQuestionSet,
  updateQuestionSet,
} from '../../../../repositories/questionSet';
import { getUsers } from '../../../../repositories/user';
import { Question } from '../../../../entities/Question';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../../services/useUsers';

export const useAccentsQuestionPage = (id: string) => {
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionGroupID, setQuestionGroupID] = useState('');
  const [questionIDs, setQuestionIDs] = useState<string[]>([]);
  const [originalQuestionSet, setOriginalQuestionSet] =
    useState<QuestionSet | null>(null);
  const [japanese, setJapanese] = useState('');
  const [accentString, setAccentString] = useState('');
  const [disabledsArray, setDisabledsArray] = useState<number[][]>([]);
  const [audios, setAudios] = useState<Audio[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers(5);
      if (!!users) {
        setUsers(users);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const questionSet = await getQuestionSet(id);
      if (!!questionSet) {
        setTitle(questionSet.title);
        setUid(questionSet.uid);
        setIsAnswered(questionSet.answered);
        setQuestionGroupID(questionSet.questionGroups[0]);
        setOriginalQuestionSet(questionSet);
      }
      setInitializing(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!questionGroupID) return;
    const fetchData = async () => {
      const questionGroup = await getQuestionGroup(questionGroupID);
      !!questionGroup && setQuestionIDs(questionGroup.questions);
    };
    fetchData();
  }, [questionGroupID]);

  useEffect(() => {
    if (!questionIDs.length) return;
    const fetchData = async () => {
      const japaneses: { [id: string]: string } = {};
      const accentStrings: { [id: string]: string } = {};
      const disabledsArrays: { [id: string]: number[] } = {};
      const audios: { [id: string]: Audio } = {};
      const originalQuestions: { [id: string]: Question } = {};
      await Promise.all(
        questionIDs.map(async (id) => {
          const question = await getQuestion(id);
          if (!!question) {
            japaneses[id] = JSON.parse(question.question).japanese;
            accentStrings[id] = buildAccentString(
              JSON.parse(question.question).accents
            );
            disabledsArrays[id] = JSON.parse(question.question).disableds;
            audios[id] = JSON.parse(question.question).audio;
            originalQuestions[id] = question;
          }
        })
      );
      setJapanese(questionIDs.map((id) => japaneses[id]).join('\n'));
      setAccentString(questionIDs.map((id) => accentStrings[id]).join('\n'));
      setDisabledsArray(questionIDs.map((id) => disabledsArrays[id]));
      setAudios(questionIDs.map((id) => audios[id]));
      setOriginalQuestions(questionIDs.map((id) => originalQuestions[id]));
    };
    fetchData();
  }, [questionIDs]);

  const onChangeUid = (uid: string) => {
    setUid(uid);
  };
  const onChangeTitle = (title: string) => {
    setTitle(title);
  };
  const onChangeIsAnswered = (isAnswered: boolean) => {
    setIsAnswered(isAnswered);
  };
  const onChangeJapanese = (japanese: string) => {
    setJapanese(japanese);
  };
  const onChangeAccentString = (accentString: string) => {
    setAccentString(accentString);
  };
  const onChangeDisabled = (sentenceIndex: number, wordIndex: number) => {
    const newDisabledsArray: number[][] = JSON.parse(
      JSON.stringify(disabledsArray)
    );
    if (newDisabledsArray[sentenceIndex].includes(wordIndex)) {
      newDisabledsArray[sentenceIndex] = newDisabledsArray[
        sentenceIndex
      ].filter((i) => i !== wordIndex);
    } else {
      newDisabledsArray[sentenceIndex].push(wordIndex);
    }
    setDisabledsArray(newDisabledsArray);
  };

  const onSubmit = async () => {
    let questionCount = 0;
    const accentsArray = accentString.split('\n').map((a) => buildAccents(a));
    accentsArray.forEach((accents, sentenceIndex) => {
      questionCount += accents.length;
      questionCount -= disabledsArray[sentenceIndex].length;
    });
    const questionSet: QuestionSet = {
      ...originalQuestionSet!,
      title,
      uid,
      questionCount,
      answered: isAnswered,
      userDisplayname: users.filter((user) => user.id === uid)[0].displayname,
    };
    const { success } = await updateQuestionSet(questionSet);
    if (success) {
      const japaneses = japanese.split('\n');
      const accentsArray = accentString.split('\n').map((a) => buildAccents(a));
      const questions: Question[] = originalQuestions.map((q, index) => {
        const question = JSON.stringify({
          japanese: japaneses[index],
          disableds: disabledsArray[index],
          audio: audios[index],
          accents: accentsArray[index],
        });
        return {
          ...q,
          question,
        };
      });
      const { success } = await updateQuestions(questions);
      if (success) {
        navigate(`/accentsQuestion/list`);
      }
    }
  };

  return {
    initializing,
    title,
    uid,
    users,
    onChangeUid,
    onChangeTitle,
    isAnswered,
    onChangeIsAnswered,
    japanese,
    onChangeJapanese,
    accentString,
    onChangeAccentString,
    disabledsArray,
    onChangeDisabled,
    audios,
    onSubmit,
  };
};
