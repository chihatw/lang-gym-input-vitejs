import AudioEdit from '@bit/chihatw.lang-gym.audio-edit';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router';
import { useEditArticleVoicePage } from './services/editArticleVoicePage';
import TableLayout from '../../../templates/TableLayout';

const EditArticleVoicePage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { title, initializing, ...props } = useEditArticleVoicePage(
    match.params.id
  );
  if (initializing) {
    return <></>;
  } else {
    if (!props.downloadURL) {
      return <Redirect to={`/article/${match.params.id}/voice/initial`} />;
    } else {
      return (
        <TableLayout title={`${title} - 録音`} backURL={`/article/list`}>
          <AudioEdit {...props} />
        </TableLayout>
      );
    }
  }
};

export default EditArticleVoicePage;
