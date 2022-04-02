import { Button, Container } from '@mui/material';
import React from 'react';
import TableLayoutHeader from '../../components/organisms/TableLayoutHeader';
import { usePatchPage } from './services/batchPage';

const BatchPage = () => {
  const { onClick_A } = usePatchPage();
  return (
    <Container maxWidth='sm'>
      <div style={{ padding: '32px 0 160px' }}>
        <TableLayoutHeader title='バッチ処理' />
        <div style={{ height: 16 }} />
        <div>
          <Button variant='contained' onClick={onClick_A} disabled={true}>
            ボタンA
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default BatchPage;
