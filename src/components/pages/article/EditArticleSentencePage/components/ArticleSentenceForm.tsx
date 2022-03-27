import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import React from 'react';
import { buildAccents } from '../../../../../entities/Accent';
import { Article } from '../../../../../entities/Article';
import { Sentence } from '../../../../../entities/Sentence';
import { useArticleSentenceForm } from '../services/articleSentenceForm';
import { Button, TextField } from '@mui/material';
const ArticleSentenceForm: React.FC<{
  article: Article;
  sentence: Sentence;
}> = ({ article, sentence }) => {
  const { end, items, start, onSubmit, accentString } = useArticleSentenceForm(
    article.id,
    sentence
  );
  return (
    <div>
      <div style={{ color: '#555', fontSize: 14 }}>
        {`${sentence.line + 1}行目`}
      </div>
      <div style={{ height: 16 }} />
      {items.map((item, index) => (
        <div key={index}>
          <TextField
            variant='outlined'
            size='small'
            fullWidth
            rows={item.rows}
            type={item.type}
            label={item.label}
            value={item.value}
            onChange={item.onChange}
            multiline={item.multiline}
          />
          {item.label === 'accents' && (
            <div style={{ padding: '16px 8px 0' }}>
              <SentencePitchLine accents={buildAccents(accentString)} />
            </div>
          )}
          <div style={{ height: 16 }} />
        </div>
      ))}
      <Speaker start={start} end={end} downloadURL={article.downloadURL} />
      <div style={{ height: 16 }} />
      <Button
        variant='contained'
        color='primary'
        fullWidth
        style={{ color: 'white' }}
        onClick={onSubmit}
      >
        更新
      </Button>
    </div>
  );
};

export default ArticleSentenceForm;
