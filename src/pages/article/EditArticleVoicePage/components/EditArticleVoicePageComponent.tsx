import AudioEdit from '@bit/chihatw.lang-gym.audio-edit';
import { Button } from '@mui/material';
import React from 'react';
import TableLayout from '../../../../components/templates/TableLayout';
import { Mark } from '../../../../entities/Mark';
import { Article } from '../../../../services/useArticles';

const EditArticleVoicePageComponent = ({
  marks,
  article,
  sentences,
  hasChange,
  onUpload,
  onSubmit,
  onChangeMarks,
  onDeleteAudio,
}: {
  marks: Mark[];
  article: Article;
  sentences: string[];
  hasChange: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSubmit: () => Promise<void>;
  onChangeMarks: (marks: Mark[]) => void;
  onDeleteAudio: () => Promise<void>;
}) => (
  <TableLayout title={`${article.title} - 録音`} backURL='/article/list'>
    {article.downloadURL ? (
      <>
        {!!sentences.length && (
          <AudioEdit
            marks={marks}
            hasChange={hasChange}
            sentences={sentences}
            onSubmit={onSubmit}
            onDeleteAudio={onDeleteAudio}
            onChangeMarks={onChangeMarks}
            downloadURL={article.downloadURL}
          />
        )}
      </>
    ) : (
      <Button variant='contained' component='label'>
        アップロード
        <input
          aria-label='audio mp3 upload'
          type='file'
          style={{ display: 'none' }}
          onChange={onUpload}
        />
      </Button>
    )}
  </TableLayout>
);

export default EditArticleVoicePageComponent;
