import Edit from '@mui/icons-material/Edit';
import React from 'react';

import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import { Button, Card, IconButton } from '@mui/material';
import { useNavigate, useMatch } from 'react-router-dom';

import { Accent } from '../../../../entities/Accent';

import SelectUser from '../../../../components/SelectUser';
import { User } from '../../../../services/useUsers';
import { AssignmentSentence } from '../../../../services/useAssignmentSentences';
import { OndokuSentence } from '../../../../services/useOndokuSentences';
import Speaker from '../../../../components/Speaker';

const OndokuAssignment: React.FC<{
  users: User[];
  sentences: OndokuSentence[];
  downloadURL: string;
  assignmentSentences: AssignmentSentence[];
  onDelete: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeUid: (uid: string) => void;
}> = ({
  users,
  sentences,
  downloadURL,
  assignmentSentences,
  onDelete,
  onUpload,
  onChangeUid,
}) => {
  return (
    <div>
      {!!users.length && (
        <>
          <SelectUser users={users} onChangeUid={onChangeUid} />
          <div style={{ height: 16 }} />
        </>
      )}
      {!!sentences.length &&
        assignmentSentences.map(
          ({ id, start, end, uid, line, accents }, index) => {
            const { japanese, accents: sentenceAccents } = sentences[index];
            return (
              <div key={id}>
                <Card>
                  <div style={{ padding: 8 }}>
                    <CorrectSentence
                      japanese={japanese}
                      accents={sentenceAccents}
                    />
                    <div style={{ marginTop: 16, padding: 8 }}>
                      <SentencePitchLine
                        pitchesArray={accentsForPitchesArray(accents)}
                      />
                      <AssignmentSentenceFooter
                        downloadURL={downloadURL}
                        start={start}
                        end={end}
                        uid={uid}
                        line={line}
                      />
                    </div>
                  </div>
                </Card>
                <div style={{ height: 16 }} />
              </div>
            );
          }
        )}
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
          style={{ color: 'white' }}
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

export default OndokuAssignment;

const CorrectSentence: React.FC<{ japanese: string; accents: Accent[] }> = ({
  japanese,
  accents,
}) => (
  <div style={{ background: '#eee', padding: 8, borderRadius: 4 }}>
    <div style={{ fontSize: 12, color: '#555' }}>{japanese}</div>
    <SentencePitchLine pitchesArray={accentsForPitchesArray(accents)} />
  </div>
);

const AssignmentSentenceFooter: React.FC<{
  downloadURL: string;
  start: number;
  end: number;
  uid: string;
  line: number;
}> = ({ downloadURL, start, end, uid, line }) => {
  const navigate = useNavigate();
  const match = useMatch('/ondoku/:id/assignment');
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Speaker start={start} end={end} downloadURL={downloadURL} />
      <IconButton
        onClick={() =>
          navigate(
            `/ondoku/${match?.params.id}/assignment/uid/${uid}/line/${line}`
          )
        }
      >
        <EditIcon />
      </IconButton>
    </div>
  );
};
