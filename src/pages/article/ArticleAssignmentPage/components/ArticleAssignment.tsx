import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Sentence } from '../../../../entities/Sentence';
import AssignmentCard from './AssignmentCard';
import { AssignmentSentence } from '../../../../entities/AssignmentSentence';

const ArticleAssignment: React.FC<{
  articleId: string;
  sentences: Sentence[];
  downloadURL: string;
  assignmentSentences: AssignmentSentence[];
  onDelete: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  articleId,
  sentences,
  downloadURL,
  assignmentSentences,
  onDelete,
  onUpload,
}) => {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      {!!sentences.length &&
        assignmentSentences.map((assignmentSentence, index) => (
          <AssignmentCard
            index={index}
            downloadURL={downloadURL}
            sentence={sentences[index]}
            assignmentSentence={assignmentSentence}
            handleClick={() =>
              navigate(
                `/article/${articleId}/assignment/uid/${assignmentSentence.uid}/line/${assignmentSentence.line}`
              )
            }
          />
        ))}
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
