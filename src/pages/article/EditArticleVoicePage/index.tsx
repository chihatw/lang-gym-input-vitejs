import React, { useContext } from 'react';
import AudioEdit from '@bit/chihatw.lang-gym.audio-edit'; // TODO 内部化
import { Navigate } from 'react-router-dom';

import TableLayout from '../../../components/templates/TableLayout';
import { useEditArticleVoicePage } from './services/editArticleVoicePage';
import { AppContext } from '../../../services/app';

const EditArticleVoicePage = () => {
  const { article, isFetching } = useContext(AppContext);
  const { ...props } = useEditArticleVoicePage({ article });
  if (isFetching) {
    return <></>;
  } else {
    if (!article.downloadURL) {
      return <Navigate to={`/article/${article.id}/voice/initial`} />;
    } else {
      return (
        <TableLayout
          title={`${article.title} - 録音`}
          backURL={`/article/list`}
        >
          {!!props.sentences.length && (
            <AudioEdit {...props} downloadURL={article.downloadURL} />
          )}
        </TableLayout>
      );
    }
  }
};

export default EditArticleVoicePage;
