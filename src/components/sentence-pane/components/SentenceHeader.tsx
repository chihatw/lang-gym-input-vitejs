import { IconButton } from '@mui/material';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';
import React, { useContext } from 'react';

import BodyTexts from './BodyTexts';
import { SentencePaneContext } from '../sentence-pane';

const SentenceHeader: React.FC<{
  headerEl: React.RefObject<HTMLDivElement>;
  bodyTexts: string[];
  mesureRef: (node: HTMLDivElement) => void;
  backgroundColor: string;
}> = ({ headerEl, bodyTexts, mesureRef, backgroundColor }) => {
  const { handleOpenSentence, openSentence } = useContext(SentencePaneContext);
  return (
    <div ref={mesureRef}>
      <div style={{ display: 'flex', backgroundColor }}>
        <IconButton size="small" onClick={() => handleOpenSentence()}>
          {openSentence ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </IconButton>
        <div
          ref={headerEl}
          style={{
            display: 'flex',
            minHeight: 32,
            paddingRight: '0 16px',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <BodyTexts labels={bodyTexts} />
        </div>
      </div>
    </div>
  );
};

export default SentenceHeader;
