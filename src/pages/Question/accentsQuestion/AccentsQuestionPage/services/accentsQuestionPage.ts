import { useContext, useEffect, useState } from 'react';
import {
  Accent,
  buildAccents,
  buildAccentString,
} from '../../../../../entities/Accent';
import { Audio } from '../../../../../entities/Audio';

import { useNavigate } from 'react-router-dom';
import {
  Question,
  useHandleQuestions,
} from '../../../../../services/useQuestions';
import {
  QuestionSet,
  useHandleQuestionSets,
} from '../../../../../services/useQuestionSets';
import { AppContext } from '../../../../../services/app';

export const useAccentsQuestionPage = (id: string) => {
  const navigate = useNavigate();

  const { questionSet, questionGroup, questions } = useContext(AppContext);

  const { updateQuestionSet } = useHandleQuestionSets();
  const { updateQuestions } = useHandleQuestions();

  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionIDs, setQuestionIDs] = useState<string[]>([]);
  const [japanese, setJapanese] = useState('');
  const [accentString, setAccentString] = useState('');
  const [disabledsArray, setDisabledsArray] = useState<number[][]>([]);
  const [audios, setAudios] = useState<Audio[]>([]);

  useEffect(() => {
    setTitle(questionSet.title);
    setUid(questionSet.uid);
    setIsAnswered(questionSet.answered);
  }, [questionSet]);

  useEffect(() => {
    setQuestionIDs(questionGroup.questions);
  }, [questionGroup]);

  useEffect(() => {
    if (!questionIDs.length || !questions.length) return;

    const audios: Audio[] = [];
    const japaneses: string[] = [];
    const accentStrings: string[] = [];
    const disabledsArrays: number[][] = [];

    questions.forEach((question) => {
      const {
        audio,
        japanese,
        accents,
        disableds,
      }: {
        audio: Audio;
        japanese: string;
        accents: Accent[];
        disableds: number[];
      } = JSON.parse(question.question);

      audios.push(audio);
      japaneses.push(japanese);
      accentStrings.push(buildAccentString(accents));
      disabledsArrays.push(disableds);
    });

    setJapanese(japaneses.join('\n'));
    setAccentString(accentStrings.join('\n'));
    setDisabledsArray(disabledsArrays);
    setAudios(audios);
  }, [questionIDs, questions]);

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
    const newQuestionSet: QuestionSet = {
      ...questionSet,
      title,
      uid,
      questionCount,
      answered: isAnswered,
      userDisplayname: '',
      // userDisplayname: users.filter((user) => user.id === uid)[0].displayname,
    };
    const updatedQuestionSet = await updateQuestionSet(newQuestionSet);
    if (!!updatedQuestionSet) {
      const japaneses = japanese.split('\n');
      const accentsArray = accentString.split('\n').map((a) => buildAccents(a));
      const newQuestions: Question[] = questions.map((q, index) => {
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
      const result = await updateQuestions(newQuestions);
      if (!!result) {
        navigate(`/accentsQuestion/list`);
      }
    }
  };

  return {
    initializing: false,
    title,
    uid,
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
