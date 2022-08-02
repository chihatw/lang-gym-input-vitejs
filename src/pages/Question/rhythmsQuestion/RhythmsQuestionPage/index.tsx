import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { RhythmsQuestionPageContext } from './services/rhythmsQuestionPage';
import RhythmsQuestionForm from './components/RhythmsQuestionForm';
import TableLayout from '../../../../components/templates/TableLayout';
import { AppContext } from '../../../../services/app';
import {
  QuestionSet,
  useHandleQuestionSets,
} from '../../../../services/useQuestionSets';
import { useHandleQuestionGroups } from '../../../../services/useQuestionGroups';
import {
  Question,
  useHandleQuestions,
} from '../../../../services/useQuestions';
import { Audio } from '../../../../entities/Audio';
import {
  buildRhythmString,
  buildSentenceRhythm,
  Rhythm,
  SentenceRhythm,
  WordRhythm,
} from '../../../../entities/Rhythm';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';

const RhythmsQuestionPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  const { users } = state;
  const { questionSet, questions, questionGroup } = useContext(AppContext);

  const { updateQuestionSet } = useHandleQuestionSets();
  const { updateQuestionGroup } = useHandleQuestionGroups();
  const { updateQuestions, deleteQuestions } = useHandleQuestions();

  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');

  const [isAnswered, setIsAnswered] = useState(false);
  const [questionIDs, setQuestionIDs] = useState<string[]>([]);
  const [rhythmString, setRhythmString] = useState('');
  const [disabledsArray, setDisabledsArray] = useState<string[][][]>([]);
  const [audios, setAudios] = useState<Audio[]>([]);
  const [sentenceRhythmArray, setSentenceRhythmArray] = useState<Rhythm[][][]>(
    []
  );

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

    const rhythmStringsObj: string[] = [];
    const disabledsArrays: string[][][] = [];
    const audios: Audio[] = [];

    questions.forEach((question) => {
      const {
        audio,
        syllableUnits,
      }: { audio: Audio; syllableUnits: SentenceRhythm } = JSON.parse(
        question.question
      );

      audios.push(audio);
      rhythmStringsObj.push(buildRhythmString(syllableUnits));
      disabledsArrays.push(
        syllableUnits.map((wordRhythm: WordRhythm) =>
          wordRhythm.map((r) => r.disabled)
        )
      );
    });

    setAudios(audios);
    setRhythmString(rhythmStringsObj.join('\n'));
    setDisabledsArray(disabledsArrays);
    setSentenceRhythmArray(
      rhythmStringsObj.map((item) => buildSentenceRhythm(item))
    );
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
    const newQuestionSet: QuestionSet = {
      ...questionSet,
      title,
      uid,
      questionCount,
      answered: isAnswered,
      userDisplayname: users.filter((user) => user.id === uid)[0].displayname,
    };
    const updatedQuestionSet = await updateQuestionSet(newQuestionSet);
    if (!!updatedQuestionSet) {
      const originalQuestionIds = questions.map((q) => q.id);
      const questionIds = originalQuestionIds.slice(0, sentenceRhythms.length);
      const deleteQuestionIDs = questions
        .map((q) => q.id)
        .filter((id) => !questionIds.includes(id));

      const result = await deleteQuestions(deleteQuestionIDs);
      if (!!result) {
        const newQuestionGroup = {
          ...questionGroup,
          questions: questionIds,
        };
        const result = await updateQuestionGroup(newQuestionGroup);
        if (!!result) {
          const newQuestions: Question[] = sentenceRhythms.map(
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
                ...questions[sentenceIndex],
                question,
              };
            }
          );
          const result = await updateQuestions(newQuestions);

          if (!!result) {
            navigate(`/rhythmsQuestion/list`);
          }
        }
      }
    }
  };

  return (
    <TableLayout title={title} backURL='/rhythmsQuestion/list'>
      <RhythmsQuestionPageContext.Provider
        value={{
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
          onChangeDisabled,
          onChangeIsAnswered,
          onChangeRhythmString,
          onChangeWordDisabled,
          onDeleteSentence,
        }}
      >
        <RhythmsQuestionForm
          state={state}
          dispatch={dispatch}
          title={title}
          uid={uid}
          users={users}
          onChangeUid={onChangeUid}
          onChangeTitle={onChangeTitle}
          isAnswered={isAnswered}
          onChangeIsAnswered={onChangeIsAnswered}
          rhythmString={rhythmString}
          onChangeRhythmString={onChangeRhythmString}
          disabledsArray={disabledsArray}
          audios={audios}
          onSubmit={onSubmit}
          questions={questions}
        />
      </RhythmsQuestionPageContext.Provider>
    </TableLayout>
  );
};

export default RhythmsQuestionPage;
