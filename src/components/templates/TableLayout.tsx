import { Button, Container, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TableLayout: React.FC<{
  title: string;
  backURL?: string;
  onCreate?: () => void;
  maxWidth?: 'sm' | 'xs' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}> = ({ children, title, backURL = '/', onCreate, maxWidth }) => {
  const navigate = useNavigate();
  return (
    <Container maxWidth={maxWidth || 'sm'}>
      <div style={{ margin: '32px 0 160px' }}>
        <div>
          <Typography variant='h5'>{title}</Typography>
          <div style={{ height: 16 }} />
          <Button variant='contained' onClick={() => navigate(backURL)}>
            戻る
          </Button>
          <div style={{ height: 16 }} />
          {!!onCreate && (
            <Button variant='contained' onClick={() => onCreate()}>
              新規作成
            </Button>
          )}
        </div>
        <div style={{ height: 16 }} />
        <div>{children}</div>
      </div>
    </Container>
  );
};

export default TableLayout;
