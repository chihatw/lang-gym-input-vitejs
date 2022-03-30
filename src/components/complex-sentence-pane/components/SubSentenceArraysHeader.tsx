import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import { Button } from '@mui/material';
import React from 'react';

const SubSentenceArraysHeader: React.FC<{
  openSubSentences: boolean;
  onToggleOpenSubSentences: () => void;
}> = ({ openSubSentences, onToggleOpenSubSentences }) => {
  return (
    <div style={{ color: '#6AA100', display: 'flex', alignItems: 'center' }}>
      <Button
        size="small"
        style={{ color: '#739433' }}
        onClick={onToggleOpenSubSentences}
      >
        {openSubSentences ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        <span style={{ fontSize: 14, borderBottom: '1px dashed #6AA100' }}>
          解説
        </span>
      </Button>
    </div>
  );
};

export default SubSentenceArraysHeader;
