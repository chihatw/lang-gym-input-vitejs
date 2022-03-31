import Edit from '@mui/icons-material/Edit';
import React from 'react';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { Card, IconButton, Button } from '@mui/material';

import { Ondoku } from '../../../../../entities/Ondoku';
import { OndokuSentence } from '../../../../../entities/OndokuSentence';

const OndokuSentenceList: React.FC<{
  ondoku: Ondoku;
  onEdit: (ondokuSentence: OndokuSentence) => void;
  ondokuSentences: OndokuSentence[];
  onCreateRhythmsQuestion: () => void;
}> = ({ ondoku, onEdit, ondokuSentences, onCreateRhythmsQuestion }) => {
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

                  <SentencePitchLine accents={ondokuSentence.accents} />
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
                      <Edit />
                    </IconButton>
                  </div>
                </div>
              </div>
            </Card>
            <div style={{ height: 16 }} />
          </div>
        ))}

        <Button fullWidth variant='contained' onClick={onCreateRhythmsQuestion}>
          リズム問題作成
        </Button>
      </div>
    </>
  );
};

export default OndokuSentenceList;
