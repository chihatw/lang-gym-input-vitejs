import { IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import React from 'react';
import { useCommentInput } from '../services/commentInput';
import UnitInput from './UnitInput';

const CommentInput: React.FC<{
  unitID: string;
}> = ({ unitID }) => {
  const { onRemoveComment } = useCommentInput();
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{
          padding: 4,
          border: '1px solid #52a2aa',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <UnitInput unitID={unitID} />
        <IconButton
          size='small'
          style={{ color: '#52a2aa', opacity: 0.6 }}
          onClick={() => {
            onRemoveComment(unitID);
          }}
        >
          <Tooltip title='説明削除'>
            <Delete />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};

export default CommentInput;
