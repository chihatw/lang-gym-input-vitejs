import { Button, Typography } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';

const TableLayoutHeader: React.FC<{
  title: string;
  backURL?: string;
  onCreate?: () => void;
}> = ({ title, backURL = '/', onCreate }) => {
  const history = useHistory();
  return (
    <div>
      <Typography variant='h5'>{title}</Typography>
      <div style={{ height: 16 }} />
      <Button variant='contained' onClick={() => history.push(backURL)}>
        戻る
      </Button>
      <div style={{ height: 16 }} />
      {!!onCreate && (
        <Button variant='contained' onClick={() => onCreate()}>
          新規作成
        </Button>
      )}
    </div>
  );
};

export default TableLayoutHeader;
