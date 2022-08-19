import { Button, Container } from '@mui/material';
import React from 'react';
import { getQuiz } from './service';

const TempPage = () => {
  const handleGetPitchQuiz = () => {
    getQuiz('iHcs8irc');
  };
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 6 }}>
      <div style={{ display: 'grid', rowGap: 8 }}>
        <Button variant='contained' onClick={handleGetPitchQuiz}>
          quiz 取得
        </Button>
      </div>
    </Container>
  );
};

export default TempPage;
