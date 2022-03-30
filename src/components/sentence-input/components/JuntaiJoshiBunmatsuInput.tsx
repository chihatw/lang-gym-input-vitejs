import React, { useContext } from 'react';
import { Delete } from '@mui/icons-material';
import { IconButton, TextField, Tooltip } from '@mui/material';

import { Sentence } from '../entities/Sentence';
import { SentenceInputContext } from '../sentence-input';
import { useJuntaiJoshiBunmatsuInput } from '../services/juntaiJoshiBunmatsuInput';

const JuntaiJoshiBunmatsuInput = () => {
  const { onRemoveJuntaiJoshiBunmatsu, text, onChangeText } =
    useJuntaiJoshiBunmatsuInput();
  const { sentenceID, globalSentences } = useContext(SentenceInputContext);
  const sentence: Sentence | null = globalSentences[sentenceID];
  if (!!sentence) {
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 4 }} />
          <div
            style={{
              padding: 4,
              border: '1px solid #52a2aa',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ display: 'flex' }}>
              <TextField
                id={`juntaiJoshiBunmatsu_${sentence.id}`}
                variant="outlined"
                size="small"
                value={text}
                onChange={(e) => onChangeText(e.target.value.trim())}
              />
              <span
                id={`juntaiJoshiBunmatsuMetrics_${sentence.id}`}
                style={{
                  display: 'inline-block',
                  position: 'absolute',
                  height: 0,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  clip: 'rect(0 0 0 0)',
                  clipPath: 'inset(50%)',
                }}
              ></span>
              <IconButton
                size="small"
                style={{ color: '#ccc' }}
                onClick={onRemoveJuntaiJoshiBunmatsu}
              >
                <Tooltip title="準体助詞文末削除">
                  <Delete />
                </Tooltip>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

export default JuntaiJoshiBunmatsuInput;
