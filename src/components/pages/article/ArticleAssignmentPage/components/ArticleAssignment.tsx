import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import { Button, Card, IconButton } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { AssignmentSentence } from '../../../../../entities/AssignmentSentence';
import { Sentence } from '../../../../../entities/Sentence';

const ArticleAssignment: React.FC<{
  sentences: Sentence[];
  assignmentSentences: AssignmentSentence[];
  downloadURL: string;
  onDelete: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ assignmentSentences, sentences, downloadURL, onDelete, onUpload }) => {
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
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
                    <SentencePitchLine accents={s.accents} />
                  </div>
                  <div style={{ height: 16 }} />
                  <div style={{ padding: 8 }}>
                    <SentencePitchLine accents={assignmentSentence.accents} />
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
                          history.push(
                            `/article/${match.params.id}/assignment/uid/${assignmentSentence.uid}/line/${assignmentSentence.line}`
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
