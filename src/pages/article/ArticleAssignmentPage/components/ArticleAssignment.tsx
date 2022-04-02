import Edit from '@mui/icons-material/Edit';
import React from 'react';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Button, Card, IconButton } from '@mui/material';
import { useNavigate, useMatch } from 'react-router-dom';
import accentsForPitchesArray from 'accents-for-pitches-array';

import { Sentence } from '../../../../entities/Sentence';
import { AssignmentSentence } from '../../../../entities/AssignmentSentence';

const ArticleAssignment: React.FC<{
  sentences: Sentence[];
  assignmentSentences: AssignmentSentence[];
  downloadURL: string;
  onDelete: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ assignmentSentences, sentences, downloadURL, onDelete, onUpload }) => {
  const navigate = useNavigate();
  const match = useMatch('/article/:id/assignment');
  return (
    <div>
      {!!sentences.length &&
        assignmentSentences.map((assignmentSentence, index) => {
          const s = sentences[index];
          return (
            <div key={assignmentSentence.id}>
              <Card>
                <div style={{ padding: 8, fontSize: 12, color: '#555' }}>
                  <div>{`${index + 1}.`}</div>
                  <div style={{ height: 8 }} />
                  <div
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      backgroundColor: '#eee',
                    }}
                  >
                    <div>{s.japanese}</div>
                    <SentencePitchLine
                      pitchesArray={accentsForPitchesArray(s.accents)}
                    />
                  </div>
                  <div style={{ height: 16 }} />
                  <div style={{ padding: 8 }}>
                    <SentencePitchLine
                      pitchesArray={accentsForPitchesArray(
                        assignmentSentence.accents
                      )}
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Speaker
                        start={assignmentSentence.start}
                        end={assignmentSentence.end}
                        downloadURL={downloadURL}
                      />
                      <IconButton
                        onClick={() =>
                          navigate(
                            `/article/${match?.params.id}/assignment/uid/${assignmentSentence.uid}/line/${assignmentSentence.line}`
                          )
                        }
                      >
                        <Edit />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Card>
              <div style={{ height: 16 }} />
            </div>
          );
        })}
      {!downloadURL ? (
        <Button variant='contained' component='label'>
          アップロード
          <input
            aria-label='audio mp3 upload'
            type='file'
            style={{ display: 'none' }}
            onChange={onUpload}
          />
        </Button>
      ) : (
        <Button
          fullWidth
          color='secondary'
          variant='contained'
          style={{ textTransform: 'none' }}
          onClick={() => {
            if (window.confirm(`提出アクセントを削除しますか`)) {
              onDelete();
            }
          }}
        >
          delete
        </Button>
      )}
    </div>
  );
};

export default ArticleAssignment;
