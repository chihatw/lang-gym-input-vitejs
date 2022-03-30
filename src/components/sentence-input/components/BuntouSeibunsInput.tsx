import React, { useContext } from 'react';
import { Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { Sentence } from '../entities/Sentence';
import BuntouWordInput from './BuntouWordInput';
import { SentenceInputContext } from '../sentence-input';
import { useBuntouSeibunsInput } from '../services/buntouSeibunsInput';

const BuntouSeibunsInput: React.FC = () => {
  const { onRemoveBuntouSeibun } = useBuntouSeibunsInput();
  const { sentenceID, globalSentences } = useContext(SentenceInputContext);
  const sentence: Sentence | null = globalSentences[sentenceID];
  if (!!sentence) {
    return (
      <div style={{ display: 'flex' }}>
        {sentence.buntouSeibuns.map((wordID) => (
          <div key={wordID}>
            <div style={{ display: 'flex' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    padding: 4,
                    borderRadius: 4,
                    border: '1px solid #eee',
                  }}
                >
                  <BuntouWordInput wordID={wordID} />
                  <IconButton
                    size="small"
                    style={{ color: '#ccc' }}
                    onClick={() => onRemoveBuntouSeibun(wordID)}
                  >
                    <Tooltip title="文頭削除">
                      <Delete />
                    </Tooltip>
                  </IconButton>
                </div>
              </div>
              <div style={{ width: 4 }} />
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return <div />;
  }
};

export default BuntouSeibunsInput;
