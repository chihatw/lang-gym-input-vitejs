import { Button, Box, TextField } from '@mui/material';
import React from 'react';
import { useArticleInputLines } from '../services/articleInputLines';

import '../styles/articleInputPage.css';

const ArticleInputLines = () => {
  const {
    chinese,
    original,
    setCorrected,
    display,
    corrected,
    onExportLineSet,
  } = useArticleInputLines();

  return (
    <Box>
      <Box fontSize={14}>
        {original.map((line, index) => (
          <Box key={index}>
            <Box display='flex'>
              <Box width={24} flexShrink={0}>
                {`${index + 1}.`}
              </Box>
              <Box width='100%'>
                <Box mb={1}>{line}</Box>
                <Box mb={1}>
                  <TextField
                    value={corrected[index]}
                    fullWidth
                    size='small'
                    variant='outlined'
                    className='ArticleInputPage-Corrected-TextField'
                    multiline
                    onChange={(e) => {
                      const newCorrected = [...corrected];
                      newCorrected[index] = e.target.value;
                      setCorrected(newCorrected);
                    }}
                  />
                </Box>
                <Box
                  mb={1}
                  color='#52a2aa'
                  dangerouslySetInnerHTML={{ __html: display[index] }}
                ></Box>
                <Box color='orange' mb={1}>
                  {chinese[index]}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Box height={16} />
      <Box>
        <Button fullWidth variant='contained' onClick={onExportLineSet}>
          export line set
        </Button>
      </Box>
      <Box height={40} />
    </Box>
  );
};

export default ArticleInputLines;
