import React from 'react';
import { Button } from '@mui/material';

import TableLayout from '../../../../components/templates/TableLayout';
import { Article } from '../../../../services/useArticles';
import { Sentence } from '../../../../entities/Sentence';
import AssignmentCard from './AssignmentCard';
import { AssignmentSentence } from '../../../../services/useAssignmentSentences';

const ArticleAssignmentPageComponent = ({
  article,
  sentences,
  downloadURL,
  assignmentSentences,
  onUpload,
  onDelete,
  handleClickCard,
}: {
  article: Article;
  sentences: Sentence[];
  downloadURL: string;
  assignmentSentences: AssignmentSentence[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  handleClickCard: (value: AssignmentSentence) => void;
}) => (
  <TableLayout
    title={`${article.title} - 提出アクセント`}
    backURL='/article/list'
  >
    <div style={{ display: 'grid', rowGap: 16 }}>
      {!!sentences.length &&
        assignmentSentences.map((assignmentSentence, index) => (
          <AssignmentCard
            key={index}
            index={index}
            downloadURL={downloadURL}
            sentence={sentences[index]}
            assignmentSentence={assignmentSentence}
            handleClick={() => handleClickCard(assignmentSentence)}
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
  </TableLayout>
);

export default ArticleAssignmentPageComponent;
