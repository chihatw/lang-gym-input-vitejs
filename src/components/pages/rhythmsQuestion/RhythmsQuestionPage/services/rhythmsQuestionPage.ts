import { useEffect, useState, createContext } from 'react';
import { Audio } from '../../../../../entities/Audio';
import { QuestionSet } from '../../../../../entities/QuestionSet';
import { User } from '../../../../../entities/User';
import {
  deleteQuestions,
  getQuestion,
  updateQuestions,
} from '../../../../../repositories/question';
import {
  getQuestionGroup,
  updateQuestionGroup,
} from '../../../../../repositories/questionGroup';
import {
  getQuestionSet,
  updateQuestionSet,
} from '../../../../../repositories/questionSet';
import { getUsers } from '../../../../../repositories/user';
import { Question } from '../../../../../entities/Question';
import { useHistory } from 'react-router-dom';
import {
  buildRhythmString,
  buildSentenceRhythm,
  Rhythm,
  WordRhythm,
} from '../../../../../entities/Rhythm';
import { QuestionGroup } from '../../../../../entities/QuestionGroup';

export const RhythmsQuestionPageContext = createContext<{
  uid: string;
  users: User[];
  audios: Audio[];
  isAnswered: boolean;
  rhythmString: string;
  disabledsArray: string[][][];
  sentenceRhythmArray: Rhythm[][][];
  onSubmit: () => void;
  onChangeUid: (uid: string) => void;
  onChangeTitle: (title: string) => void;
  onDeleteSentence: (sentenceIndex: number) => void;
  onChangeDisabled: (
    sentenceIndex: number,
    wordIndex: number,
    syllableIndex: number
  ) => void;
  onChangeWordDisabled: (sentenceIndex: number, wordIndex: number) => void;
  onChangeRhythmString: (rhythmString: string) => void;
  onChangeIsAnswered: (isAnswered: boolean) => void;
}>({
  uid: '',
  users: [],
  audios: [],
  isAnswered: false,
  rhythmString: '',
  disabledsArray: [],
  sentenceRhythmArray: [],
  onSubmit: () => {},
  onChangeUid: () => {},
  onChangeTitle: () => {},
  onDeleteSentence: () => {},
  onChangeDisabled: () => {},
  onChangeIsAnswered: () => {},
  onChangeRhythmString: () => {},
  onChangeWordDisabled: () => {},
});

export const useRhythmsQuestionPage = (id: string) => {
  const history = useHistory();
  const [initializing, setInitializing] = useState(true);
  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionGroupID, setQuestionGroupID] = useState('');
  const [questionIDs, setQuestionIDs] = useState<string[]>([]);
  const [originalQuestionGroup, setOriginalQuestionGroup] =
    useState<QuestionGroup | null>(null);
  const [originalQuestionSet, setOriginalQuestionSet] =
    useState<QuestionSet | null>(null);
  const [rhythmString, setRhythmString] = useState('');
  const [disabledsArray, setDisabledsArray] = useState<string[][][]>([]);
  const [audios, setAudios] = useState<Audio[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [sentenceRhythmArray, setSentenceRhythmArray] = useState<Rhythm[][][]>(
    []
  );

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
      if (!!questionGroup) {
        setQuestionIDs(questionGroup.questions);
        setOriginalQuestionGroup(questionGroup);
      }
    };
    fetchData();
  }, [questionGroupID]);

  useEffect(() => {
    if (!questionIDs.length) return;
    const fetchData = async () => {
      const rhythmStringsObj: { [id: string]: string } = {};
      const disabledsArrays: { [id: string]: string[][] } = {};
      const audios: { [id: string]: Audio } = {};
      const originalQuestions: { [id: string]: Question } = {};
      await Promise.all(
        questionIDs.map(async (id) => {
          const question = await getQuestion(id);

          if (!!question) {
            rhythmStringsObj[id] = buildRhythmString(
              JSON.parse(question.question).syllableUnits
            );
            disabledsArrays[id] = JSON.parse(
              question.question
            ).syllableUnits.map((wordRhythm: WordRhythm) =>
              wordRhythm.map((r) => r.disabled)
            );
            audios[id] = JSON.parse(question.question).audio;
            originalQuestions[id] = question;
          }
        })
      );
      setSentenceRhythmArray(
        questionIDs.map((id) => buildSentenceRhythm(rhythmStringsObj[id]))
      );
      setRhythmString(questionIDs.map((id) => rhythmStringsObj[id]).join('\n'));
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
  const onChangeRhythmString = (rhythmString: string) => {
    rhythmString = rhythmString.replaceAll(' ', '　');
    const rhythmStringArray = rhythmString.split('\n');
    const sentenceRhythmArray = rhythmStringArray.map((s) =>
      buildSentenceRhythm(s)
    );
    const newDisabledsArray = sentenceRhythmArray.map(
      (sentenceRhythm, sentenceIndex) =>
        sentenceRhythm.map((wordRhythm, wordIndex) =>
          wordRhythm.map((s, syllableIndex) => {
            try {
              return disabledsArray[sentenceIndex][wordIndex][syllableIndex];
            } catch (e) {
              return '';
            }
          })
        )
    );
    setSentenceRhythmArray(sentenceRhythmArray);
    setDisabledsArray(newDisabledsArray);
    setRhythmString(rhythmString);
  };

  const onChangeDisabled = (
    sentenceIndex: number,
    wordIndex: number,
    syllableIndex: number
  ) => {
    const newDisabledsArray: string[][][] = JSON.parse(
      JSON.stringify(disabledsArray)
    );
    if (!!newDisabledsArray[sentenceIndex][wordIndex][syllableIndex]) {
      newDisabledsArray[sentenceIndex][wordIndex][syllableIndex] = '';
    } else {
      const sentenceRhythmStrings = rhythmString.split('\n');
      const sentenceRhythm = buildSentenceRhythm(
        sentenceRhythmStrings[sentenceIndex]
      );
      const specialMora = sentenceRhythm[wordIndex][syllableIndex].mora;
      newDisabledsArray[sentenceIndex][wordIndex][syllableIndex] = !!specialMora
        ? specialMora
        : 'x';
    }
    setDisabledsArray(newDisabledsArray);
  };

  const onChangeWordDisabled = (sentenceIndex: number, wordIndex: number) => {
    const newDisabledsArray: string[][][] = JSON.parse(
      JSON.stringify(disabledsArray)
    );
    let isWordDisableds = !newDisabledsArray[sentenceIndex][wordIndex].filter(
      (disabled) => !disabled
    ).length;
    if (isWordDisableds) {
      newDisabledsArray[sentenceIndex][wordIndex] = newDisabledsArray[
        sentenceIndex
      ][wordIndex].map((a) => '');
    } else {
      const sentenceRhythmStrings = rhythmString.split('\n');
      const sentenceRhythm = buildSentenceRhythm(
        sentenceRhythmStrings[sentenceIndex]
      );
      newDisabledsArray[sentenceIndex][wordIndex] = newDisabledsArray[
        sentenceIndex
      ][wordIndex].map((s, syllableIndex) => {
        const specialMora = sentenceRhythm[wordIndex][syllableIndex].mora;
        return !!specialMora ? specialMora : 'x';
      });
    }
    setDisabledsArray(newDisabledsArray);
  };

  const onDeleteSentence = (sentenceIndex: number) => {
    let newSentenceRhythmStrings = rhythmString.split('\n');
    newSentenceRhythmStrings = newSentenceRhythmStrings.filter(
      (s, index) => index !== sentenceIndex
    );
    setRhythmString(newSentenceRhythmStrings.join('\n'));
    let newDisabledsArray: string[][][] = JSON.parse(
      JSON.stringify(disabledsArray)
    );
    newDisabledsArray = newDisabledsArray.filter(
      (d, index) => index !== sentenceIndex
    );
    setDisabledsArray(newDisabledsArray);

    setAudios(audios.filter((a, index) => index !== sentenceIndex));
  };

  const onSubmit = async () => {
    let questionCount = 0;
    const sentenceRhythmStrings = rhythmString.split('\n');
    const sentenceRhythms = sentenceRhythmStrings.map((s) =>
      buildSentenceRhythm(s)
    );
    disabledsArray.forEach((sentenceDisabled, sentenceIndex) => {
      sentenceDisabled.forEach((wordDisabled) => {
        questionCount++;
        if (
          wordDisabled.length ===
          wordDisabled.filter((disabled) => !!disabled).length
        ) {
          questionCount--;
        }
      });
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
      const originalQuestionIDs = originalQuestions.map((q) => q.id);
      const questionIDs = originalQuestionIDs.slice(0, sentenceRhythms.length);
      const deleteQuestionIDs = originalQuestions
        .map((q) => q.id)
        .filter((id) => !questionIDs.includes(id));

      const { success } = await deleteQuestions(deleteQuestionIDs);
      if (success) {
        const questionGroup = {
          ...originalQuestionGroup!,
          questions: questionIDs,
        };
        const { success } = await updateQuestionGroup(questionGroup);
        if (success) {
          const questions: Question[] = sentenceRhythms.map(
            (sentenceRhythm, sentenceIndex) => {
              const question = JSON.stringify({
                audio: audios[sentenceIndex],
                japanese: '',
                syllableUnits: sentenceRhythm.map((wordRhythm, wordIndex) =>
                  wordRhythm.map((syllableRhythm, syllableIndex) => ({
                    ...syllableRhythm,
                    disabled:
                      disabledsArray[sentenceIndex][wordIndex][syllableIndex] ||
                      '',
                  }))
                ),
              });
              return {
                ...originalQuestions[sentenceIndex],
                question,
              };
            }
          );
          const { success } = await updateQuestions(questions);

          if (success) {
            history.push(`/rhythmsQuestion/list`);
          }
        }
      }
    }
  };

  return {
    initializing,
    title,
    uid,
    users,
    audios,
    isAnswered,
    rhythmString,
    disabledsArray,
    sentenceRhythmArray,
    onSubmit,
    onChangeUid,
    onChangeTitle,
    onDeleteSentence,
    onChangeDisabled,
    onChangeIsAnswered,
    onChangeRhythmString,
    onChangeWordDisabled,
  };
};
