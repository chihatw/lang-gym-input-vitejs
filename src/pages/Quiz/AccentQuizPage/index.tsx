import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TableLayout from '../../../components/templates/TableLayout';
import {
  Audio,
  INITIAL_QUESTION_SET,
  Question,
  QuestionSet,
  State,
} from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import {
  buildAccents,
  buildInitialValues,
  getQuiz,
} from '../../../services/quiz';
import { getUsers } from '../../../services/user';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import JapaneseMonitor from './JapaneseMonitor';
import AccentsMonitor from './AccentsMonitor';

const AccentQuizPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  const { questionSetId } = useParams();
  const { isFetching, memo, quiz, users, questions } = state;

  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      let _users = !!users.length ? users : await getUsers();
      if (!questionSetId) {
        dispatch({
          type: ActionTypes.setQuiz,
          payload: { quiz: INITIAL_QUESTION_SET, users: _users, questions: [] },
        });
        return;
      }
      let _quiz = INITIAL_QUESTION_SET;
      let _questions: Question[] = [];

      const memoQuiz = memo.quizzes[questionSetId];
      const memoQuestions = memo.questions[questionSetId];
      if (memoQuiz && memoQuestions) {
        _quiz = memoQuiz;
        _questions = memoQuestions;
      } else {
        const { quiz, questions } = await getQuiz(questionSetId);
        _quiz = quiz;
        _questions = questions;
      }
      console.log({ _questions });
      dispatch({
        type: ActionTypes.setQuiz,
        payload: { quiz: _quiz, users: _users, questions: _questions },
      });
    };
    fetchData();
  }, [isFetching]);

  const [uid, setUid] = useState('');
  const [title, setTitle] = useState('');
  const [audios, setAudios] = useState<Audio[]>([]);
  const [japanese, setJapanese] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [accentString, setAccentString] = useState('');
  const [disabledsArray, setDisabledsArray] = useState<number[][]>([]);

  useEffect(() => {
    const { questions, quiz } = state;
    const { title, uid, answered } = quiz;
    setUid(uid);
    setTitle(title);
    setIsAnswered(answered);
    const { audios, japanese, accentString, disabledsArray } =
      buildInitialValues(questions);
    setAudios(audios);
    setJapanese(japanese);
    setAccentString(accentString);
    setDisabledsArray(disabledsArray);
  }, [state]);

  const handleChangeDisabled = (sentenceIndex: number, wordIndex: number) => {
    setDisabledsArray((previous) => {
      let sentenceDsiableds = previous[sentenceIndex];
      // チェックを外す
      if (sentenceDsiableds.includes(wordIndex)) {
        sentenceDsiableds = sentenceDsiableds.filter((i) => i !== wordIndex);
        previous.splice(sentenceIndex, 1, sentenceDsiableds);
        return [...previous];
      }
      // チェックをつける
      sentenceDsiableds.push(wordIndex);
      previous.splice(sentenceIndex, 1, sentenceDsiableds);
      return [...previous];
    });
  };

  const handleSubmit = () => {
    let questionCount = 0;
    const japaneses = japanese.split('\n');
    const accentsArray = accentString.split('\n').map((a) => buildAccents(a));
    accentsArray.forEach((accents, sentenceIndex) => {
      questionCount += accents.length;
      questionCount -= disabledsArray[sentenceIndex].length;
    });

    // local
    const updatedQuiz: QuestionSet = {
      ...quiz,
      title,
      uid,
      questionCount,
      answered: isAnswered,
      userDisplayname: users.filter((user) => user.id === uid)[0].displayname,
    };
    const updatedQuestions: Question[] = questions.map((question, index) => {
      return {
        ...question,
        question: JSON.stringify({
          japanese: japaneses[index],
          disableds: disabledsArray[index],
          audio: audios[index],
          accents: accentsArray[index],
        }),
      };
    });
    // remote
    // todo
    navigate(`/accentsQuestion/list`);
  };

  if (isFetching) return <></>;
  return (
    <TableLayout title={title} backURL='/accentsQuestion/list'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {!!users.length && (
          <FormControl fullWidth>
            <Select
              value={uid}
              onChange={(e) => setUid(e.target.value as string)}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.displayname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <FormControlLabel
          label='answered'
          control={
            <Checkbox
              color='primary'
              checked={isAnswered}
              onChange={(e) => setIsAnswered(e.target.checked)}
            />
          }
        />

        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='japanese'
          value={japanese}
          multiline
          rows={5}
          onChange={(e) => setJapanese(e.target.value)}
        />

        {!!japanese && <JapaneseMonitor japanese={japanese} />}

        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='accentString'
          value={accentString}
          multiline
          rows={5}
          onChange={(e) => setAccentString(e.target.value)}
        />

        {!!accentString && !!disabledsArray.length && !!audios.length && (
          <AccentsMonitor
            accentString={accentString}
            audios={audios}
            disabledsArray={disabledsArray}
            onChangeDisabled={handleChangeDisabled}
          />
        )}

        <Button fullWidth variant='contained' onClick={handleSubmit}>
          送信
        </Button>
      </div>
    </TableLayout>
  );
};

export default AccentQuizPage;
