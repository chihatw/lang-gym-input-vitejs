import React from 'react';
import AudioEdit from '@bit/chihatw.lang-gym.audio-edit'; // TODO 内部化
import { Redirect, useRouteMatch } from 'react-router';

import TableLayout from '../../../templates/TableLayout';
import { useEditArticleVoicePage } from './services/editArticleVoicePage';

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
