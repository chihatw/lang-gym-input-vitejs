import { Button, Collapse, IconButton, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import WordRhythm from './WordRhythm';
import { RhythmsQuestionPageContext } from '../services/rhythmsQuestionPage';
import Speaker from '../../../../../components/Speaker';
import { useHandleQuestions } from '../../../../../services/useQuestions';
import EditIcon from '@mui/icons-material/Edit';
import { Question } from '../../../../../Model';

const SentenceRhythm = ({
  sentenceIndex,
  question,
}: {
  question: Question | null;
  sentenceIndex: number;
}) => {
  const { sentenceRhythmArray } = useContext(RhythmsQuestionPageContext);
  const sentenceRhythm = sentenceRhythmArray[sentenceIndex];
  return (
    <div>
      <IndexSpeaker sentenceIndex={sentenceIndex} />
      <div style={{ border: '1px solid #eee', borderRadius: 4, padding: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {sentenceRhythm.map((_, wordIndex) => (
            <div key={wordIndex}>
              <div style={{ display: 'flex' }}>
                <WordRhythm
                  wordIndex={wordIndex}
                  sentenceIndex={sentenceIndex}
                />
                {wordIndex !== sentenceRhythm.length - 1 && (
                  <div style={{ width: 8 }} />
                )}
              </div>
            </div>
          ))}
        </div>

        <Footer sentenceIndex={sentenceIndex} question={question} />
      </div>
    </div>
  );
};

export default SentenceRhythm;

const IndexSpeaker: React.FC<{ sentenceIndex: number }> = ({
  sentenceIndex,
}) => {
  const { audios } = useContext(RhythmsQuestionPageContext);
  const audio = audios[sentenceIndex];
  return (
    <div style={{ display: 'flex', alignContent: 'center' }}>
      <div>{sentenceIndex}</div>
      <div style={{ width: 16 }} />
      <div>
        {!!audio.downloadURL ? (
          <Speaker
            start={audio.start}
            end={audio.end}
            downloadURL={audio.downloadURL}
          />
        ) : (
          <VolumeOffIcon color='primary' />
        )}
      </div>
    </div>
  );
};

const Footer: React.FC<{
  sentenceIndex: number;
  question: Question | null;
}> = ({ sentenceIndex, question }) => {
  const { onDeleteSentence } = useContext(RhythmsQuestionPageContext);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Collapse in={open}>
        <EditPane question={question!} callback={() => setOpen(false)} />
      </Collapse>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!!question && (
          <IconButton onClick={() => setOpen(!open)}>
            <EditIcon />
          </IconButton>
        )}
        <IconButton
          size='small'
          onClick={() => onDeleteSentence(sentenceIndex)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

const EditPane = ({
  question,
  callback,
}: {
  question: Question;
  callback: () => void;
}) => {
  const { updateQuestion } = useHandleQuestions();
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');

  useEffect(() => {
    const {
      audio: { start, end, downloadURL },
    }: {
      audio: { start: number; end: number; downloadURL: string };
    } = JSON.parse(question.question);

    setStart(start);
    setEnd(end);
    setDownloadURL(downloadURL);
  }, [question]);

  const handleClickUpdate = async () => {
    let newQuestionQuestion = JSON.parse(question.question);
    newQuestionQuestion = {
      ...newQuestionQuestion,
      audio: {
        ...newQuestionQuestion.audio,
        start,
        end,
      },
    };

    const newQuestion: Question = {
      ...question,
      question: JSON.stringify(newQuestionQuestion),
    };

    const result = await updateQuestion(newQuestion);
    if (!!result) {
      callback();
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 80px 80px 80px',
        paddingTop: 16,
        columnGap: 8,
      }}
    >
      <Speaker start={start} end={end} downloadURL={downloadURL} />
      <TextField
        inputProps={{ step: 0.1 }}
        type='number'
        size='small'
        value={start}
        label='start'
        onChange={(e) => setStart(Number(e.target.value))}
      />
      <TextField
        inputProps={{ step: 0.1 }}
        type='number'
        size='small'
        value={end}
        label='end'
        onChange={(e) => setEnd(Number(e.target.value))}
      />
      <Button onClick={handleClickUpdate}>update</Button>
    </div>
  );
};
