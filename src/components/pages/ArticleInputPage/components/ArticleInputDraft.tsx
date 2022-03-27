import { Box, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

const ArticleInputDraft = () => {
  const [draft, setDraft] = useState('');

  const onExportSelectedArticle = async (
    type: 'original' | 'corrected' | 'chinese'
  ) => {
    const lines = draft.split('\n');
    const selected: string[] = [];
    lines.forEach((line) => {
      const head = line.slice(0, 3);
      const body = line.slice(3);
      switch (type) {
        case 'original':
          head === '原文：' && selected.push(body);
          break;
        case 'corrected':
          head === '修正：' && selected.push(body);
          break;
        case 'chinese':
          head === '中文：' && selected.push(body);
          break;
      }
    });
    const text = selected.join('\n');
    await navigator.clipboard.writeText(text);
    console.log(text);
  };

  const items: { label: string; type: 'original' | 'corrected' | 'chinese' }[] =
    [
      {
        label: '原文抽出',
        type: 'original',
      },
      {
        label: '修正抽出',
        type: 'corrected',
      },
      {
        label: '中文抽出',
        type: 'chinese',
      },
    ];
  return (
    <div>
      <Box>Draft</Box>
      <Box height={16} />
      <Box>
        <TextField
          fullWidth
          variant='outlined'
          multiline
          rows={20}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
          }}
        />
      </Box>
      <Box height={40} />

      {items.map((item, index) => (
        <div key={index}>
          <Box>
            <Button
              fullWidth
              variant='contained'
              onClick={() => onExportSelectedArticle(item.type)}
            >
              {item.label}
            </Button>
          </Box>
          <Box height={16} />
        </div>
      ))}
    </div>
  );
};

export default ArticleInputDraft;
