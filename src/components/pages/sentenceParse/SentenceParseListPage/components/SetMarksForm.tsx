import { Button, TextField } from '@mui/material';
import React, { useContext } from 'react';

import { SentenceParseListPageContext } from '../services/sentenceParseListPage';

const SetMarksForm = () => {
  const {
    sentences,
    explanationStr,
    setExplanationStr,
    marks,
    setMarks,
    onSubmit,
    onBatch,
  } = useContext(SentenceParseListPageContext);
  return (
    <div style={{ padding: '0 24px' }}>
      <div>marks</div>
      <div style={{ height: 8 }} />
      <div>
        {sentences.map((sentence, index) => (
          <div key={index}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 80 }}>
                <TextField
                  variant='outlined'
                  size='small'
                  value={marks[index]}
                  onChange={(e) => {
                    const newMarks = Array.from(marks);
                    newMarks[index] = e.target.value;
                    setMarks(newMarks);
                  }}
                />
              </div>
              <div style={{ width: 8 }} />
              <div>{sentence.japanese.slice(0, 30)}</div>
            </div>
            <div style={{ height: 8 }} />
          </div>
        ))}
        <Button variant='contained' onClick={onSubmit}>
          marks 更新
        </Button>
        <div style={{ height: 24 }} />
        <TextField
          multiline
          rows={20}
          variant='outlined'
          value={explanationStr}
          onChange={(e) => setExplanationStr(e.target.value)}
        />
        <div style={{ height: 8 }} />
        <Button variant='contained' onClick={onBatch}>
          Youtubeの概要欄テキストからの一括入力
        </Button>
      </div>
    </div>
  );
};

export default SetMarksForm;
