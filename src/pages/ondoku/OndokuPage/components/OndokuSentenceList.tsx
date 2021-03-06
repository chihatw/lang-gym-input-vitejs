import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import { Card, IconButton, Button } from '@mui/material';

import { Ondoku } from '../../../../services/useOndokus';
import { OndokuSentence } from '../../../../services/useOndokuSentences';
import Speaker from '../../../../components/Speaker';

const OndokuSentenceList: React.FC<{
  ondoku: Ondoku;
  onEdit: (ondokuSentence: OndokuSentence) => void;
  ondokuSentences: OndokuSentence[];
  createRhythmsQuestion: () => void;
}> = ({ ondoku, onEdit, ondokuSentences, createRhythmsQuestion }) => {
  return (
    <>
      <div>
        {ondokuSentences.map((ondokuSentence, index) => (
          <div key={index}>
            <Card>
              <div style={{ padding: 16, fontSize: 12, color: '#555' }}>
                <div>
                  <div style={{ userSelect: 'none' }}>
                    {ondokuSentence.japanese}
                  </div>
                  <div style={{ height: 16 }} />

                  <SentencePitchLine
                    pitchesArray={accentsForPitchesArray(
                      ondokuSentence.accents
                    )}
                  />
                  <div style={{ height: 16 }} />

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Speaker
                      start={ondokuSentence.start}
                      end={ondokuSentence.end}
                      downloadURL={ondoku.downloadURL}
                    />

                    <IconButton
                      size='small'
                      onClick={() => onEdit(ondokuSentence)}
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            </Card>
            <div style={{ height: 16 }} />
          </div>
        ))}

        <Button fullWidth variant='contained' onClick={createRhythmsQuestion}>
          ?????????????????????
        </Button>
      </div>
    </>
  );
};

export default OndokuSentenceList;
