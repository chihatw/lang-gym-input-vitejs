import Edit from '@mui/icons-material/Edit';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import React, { useContext } from 'react';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Card, IconButton, Tooltip, Button } from '@mui/material';
import accentesForPitchesArray from 'accents-for-pitches-array';

import { AppContext } from '../../../../../services/app';
import { ArticlePaneContext } from '../services/articlePage';
import { useArticleSentenceList } from '../services/articleSentenceList';

const ArticleSentenceList: React.FC = () => {
  const { article, sentences } = useContext(ArticlePaneContext);
  const { onCreateAccentsQuestion } = useArticleSentenceList();
  const { onCreateRhythmsQuestion } = useContext(AppContext);
  if (!!article) {
    return (
      <div>
        {sentences.map((s, index) => (
          <div key={index}>
            <SentencePane index={index} />
            <div style={{ height: 16 }} />
          </div>
        ))}

        <Button variant='contained' fullWidth onClick={onCreateAccentsQuestion}>
          アクセント問題作成
        </Button>
        <div style={{ height: 16 }} />

        <Button
          variant='contained'
          onClick={() =>
            onCreateRhythmsQuestion({
              title: article.title,
              downloadURL: article.downloadURL,
              endArray: sentences.map((sentence) => sentence.end),
              startArray: sentences.map((sentence) => sentence.start),
              accentsArray: sentences.map((sentence) => sentence.accents),
            })
          }
          fullWidth
        >
          リズム問題作成
        </Button>
      </div>
    );
  } else {
    return <div />;
  }
};

export default ArticleSentenceList;

const SentencePane: React.FC<{ index: number }> = ({ index }) => {
  const { onEdit, onEditParse } = useArticleSentenceList();
  const { article, sentences } = useContext(ArticlePaneContext);
  const sentence = sentences[index];

  return (
    <Card>
      <div style={{ padding: 16, fontSize: 12, color: '#555' }}>
        <div style={{ userSelect: 'none' }}>
          <span>{`${index + 1}. `}</span>
          <span>{sentence.japanese}</span>
        </div>
        <div style={{ height: 4 }} />
        <div style={{ color: '#aaa' }}>{sentence.original}</div>
        <div style={{ height: 0 }} />
        <div style={{ color: '#52a2aa' }}>{sentence.chinese}</div>
        <div style={{ height: 8 }} />
        <SentencePitchLine
          pitchesArray={accentesForPitchesArray(sentence.accents)}
        />
        <div style={{ height: 16 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {!!article && !!article.downloadURL && (
            <Speaker
              start={sentence.start}
              end={sentence.end}
              downloadURL={article.downloadURL}
            />
          )}
          <Tooltip title='文の形'>
            <IconButton size='small' onClick={() => onEditParse(sentence.id)}>
              <SettingsOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title='編集'>
            <IconButton size='small' onClick={() => onEdit(sentence.id)}>
              <Edit />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};
