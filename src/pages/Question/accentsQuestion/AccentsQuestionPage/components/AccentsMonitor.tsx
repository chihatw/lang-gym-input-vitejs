import React from 'react';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Checkbox } from '@mui/material';
import { PitchLine } from '@chihatw/pitch-line.pitch-line';
import string2PitchesArray from 'string2pitches-array';

import { Audio } from '../../../../../entities/Audio';
import Speaker from '../../../../../components/Speaker';

const AccentsMonitor: React.FC<{
  audios: Audio[];
  accentString: string;
  disabledsArray: number[][];
  onChangeDisabled: (sentenceIndex: number, wordIndex: number) => void;
}> = ({ accentString, audios, disabledsArray, onChangeDisabled }) => {
  const lines = accentString.split('\n');
  return (
    <div style={{ fontSize: 12, color: '#555' }}>
      <div style={{ display: 'grid', rowGap: 8 }}>
        {lines.map((line, sentenceIndex) => {
          const audio: Audio | null = audios[sentenceIndex];
          const pitchesArray = string2PitchesArray(line);
          return (
            <div key={sentenceIndex}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ paddingRight: 16 }}>{sentenceIndex}</div>
                {!!audio?.downloadURL ? (
                  <Speaker
                    start={audio.start}
                    end={audio.end}
                    downloadURL={audio.downloadURL}
                  />
                ) : (
                  <VolumeOffIcon color='primary' />
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {pitchesArray.map((pitches, wordIndex) => {
                  const isDisable =
                    disabledsArray[sentenceIndex].includes(wordIndex);
                  return (
                    <div
                      key={wordIndex}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 4,
                        backgroundColor: isDisable ? '#eee' : 'transparent',
                      }}
                    >
                      <PitchLine pitches={pitches} />
                      <Checkbox
                        size='small'
                        color='primary'
                        checked={isDisable}
                        onChange={() => {
                          onChangeDisabled(sentenceIndex, wordIndex);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccentsMonitor;
