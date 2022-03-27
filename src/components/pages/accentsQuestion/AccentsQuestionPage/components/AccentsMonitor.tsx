import Speaker from '@bit/chihatw.lang-gym.speaker';
import { Box, Checkbox, Grid } from '@mui/material';
import { Audio } from '../../../../../entities/Audio';
import { buildAccents } from '../../../../../entities/Accent';
import React from 'react';
import VolumeOff from '@mui/icons-material/VolumeOff';
import { PitchLine } from '@chihatw/lang-gym-h.ui.pitch-line';

const AccentsMonitor: React.FC<{
  accentString: string;
  audios: Audio[];
  disabledsArray: number[][];
  onChangeDisabled: (sentenceIndex: number, wordIndex: number) => void;
}> = ({ accentString, audios, disabledsArray, onChangeDisabled }) => {
  return (
    <Box fontSize={12} color='#555'>
      <Grid container direction='column' spacing={1}>
        {accentString.split('\n').map((a, sentenceIndex) => {
          const audio = audios[sentenceIndex];
          return (
            <Grid item key={sentenceIndex}>
              <Grid container alignItems='center' spacing={2}>
                <Grid item>{sentenceIndex}</Grid>
                <Grid item>
                  {!!audio.downloadURL ? (
                    <Speaker
                      start={audio.start}
                      end={audio.end}
                      downloadURL={audio.downloadURL}
                    />
                  ) : (
                    <VolumeOff color='primary' />
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                {buildAccents(a).map((wordAccent, wordIndex) => {
                  const isDisable =
                    disabledsArray[sentenceIndex].includes(wordIndex);
                  return (
                    <Grid item key={wordIndex}>
                      <Box
                        p={1}
                        borderRadius={4}
                        bgcolor={isDisable ? '#eee' : 'transparent'}
                      >
                        <PitchLine
                          moras={wordAccent.moras}
                          pitchPoint={wordAccent.pitchPoint}
                        />
                        <Checkbox
                          checked={isDisable}
                          size='small'
                          color='primary'
                          onChange={() => {
                            onChangeDisabled(sentenceIndex, wordIndex);
                          }}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AccentsMonitor;
