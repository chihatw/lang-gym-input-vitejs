import Speaker from '@bit/chihatw.lang-gym.speaker';
import React, { useState } from 'react';
import { Collapse, IconButton } from '@mui/material';
import { Edit, SettingsOutlined } from '@mui/icons-material';

import { Sentence } from '../../../../entities/Sentence';

const EditSentencePane = ({
  sentence,
  downloadURL,
  openEditPage,
  openEditParsePage,
}: {
  sentence: Sentence;
  downloadURL: string;
  openEditPage: () => void;
  openEditParsePage: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenEditPane = () => {
    openEditPage();
    setOpen(!open);
    // TODO useSentences を作成してから、編集が行えるようにする
  };
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {!!downloadURL && sentence.end - sentence.start > 0 && (
          <Speaker
            end={sentence.end}
            start={sentence.start}
            downloadURL={downloadURL}
          />
        )}

        <IconButton size='small' onClick={openEditParsePage}>
          <SettingsOutlined />
        </IconButton>

        <IconButton size='small' onClick={handleOpenEditPane}>
          <Edit />
        </IconButton>
      </div>
      <Collapse in={open}>edit pane</Collapse>
    </div>
  );
};

export default EditSentencePane;
