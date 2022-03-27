import { Box, Container, TextField } from '@mui/material';
import React from 'react';
import ArticleInputLines from './components/ArticleInputLines';
import {
  ArticleInputPageContext,
  useArticleInputPage,
} from './services/articleInputPage';
import ArticleInputDraft from './components/ArticleInputDraft';

const ArticleInputPage = () => {
  const {
    items,
    chinese,
    original,
    corrected,
    setChinese,
    setOriginal,
    setCorrected,
  } = useArticleInputPage();
  return (
    <ArticleInputPageContext.Provider
      value={{
        chinese,
        original,
        corrected,
        setChinese,
        setOriginal,
        setCorrected,
      }}
    >
      <Container maxWidth='md'>
        <Box mt={5} mb={40} px={16}>
          {items.map((item, index) => (
            <div key={index}>
              <Box>{item.label}</Box>
              <Box height={16} />
              <Box>
                <TextField
                  fullWidth
                  variant='outlined'
                  multiline
                  rows={20}
                  value={item.value}
                  onChange={item.onChange}
                />
              </Box>
              {!!items[index + 1] && <Box height={40} />}
            </div>
          ))}
          <Box height={16} />
          <ArticleInputLines />
          <ArticleInputDraft />
        </Box>
      </Container>
    </ArticleInputPageContext.Provider>
  );
};

export default ArticleInputPage;
