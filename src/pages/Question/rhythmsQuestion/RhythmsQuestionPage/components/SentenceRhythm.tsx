import Speaker from '@bit/chihatw.lang-gym.speaker';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import Delete from '@mui/icons-material/Delete';
import VolumeOff from '@mui/icons-material/VolumeOff';
import WordRhythm from './WordRhythm';
import { RhythmsQuestionPageContext } from '../services/rhythmsQuestionPage';

const SentenceRhythm: React.FC<{
  sentenceIndex: number;
}> = ({ sentenceIndex }) => {
  const { sentenceRhythmArray } = useContext(RhythmsQuestionPageContext);
  const sentenceRhythm = sentenceRhythmArray[sentenceIndex];
  return (
    <>
      <IndexSpeaker sentenceIndex={sentenceIndex} />
      <div style={{ border: '1px solid #eee', borderRadius: 4, padding: 8 }}>
        <div>
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
        </div>
        <DeleteButton sentenceIndex={sentenceIndex} />
      </div>
    </>
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
          <VolumeOff color='primary' />
        )}
      </div>
    </div>
  );
};

const DeleteButton: React.FC<{ sentenceIndex: number }> = ({
  sentenceIndex,
}) => {
  const { onDeleteSentence } = useContext(RhythmsQuestionPageContext);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <IconButton size='small' onClick={() => onDeleteSentence(sentenceIndex)}>
        <Delete />
      </IconButton>
    </div>
  );
};
