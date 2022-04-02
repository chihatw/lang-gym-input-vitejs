import React, { useContext } from 'react';
import { Navigate, useMatch } from 'react-router-dom';

import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import { useOndokuPage } from './services/ondokuPage';
import OndokuSentenceList from './components/OndokuSentenceList';

const OndokuSentencesPage: React.FC = () => {
  const match = useMatch('/ondoku/:id');
  const { title, onEdit, ondoku, initializing, ondokuSentences } =
    useOndokuPage(match?.params.id || '');
  const { onCreateRhythmsQuestion } = useContext(AppContext);
  if (!initializing && !ondokuSentences.length) {
    return <Navigate to={`/ondoku/${match?.params.id}/initial`} />;
  }
  if (initializing) {
    return <div></div>;
  } else {
    if (!!ondoku) {
      return (
        <TableLayout title={title} backURL={`/ondoku/list`}>
          <OndokuSentenceList
            ondokuSentences={ondokuSentences}
            onCreateRhythmsQuestion={() =>
              onCreateRhythmsQuestion({
                title: ondoku.title,
                downloadURL: ondoku.downloadURL,
                endArray: ondokuSentences.map((sentence) => sentence.end),
                startArray: ondokuSentences.map((sentence) => sentence.start),
                accentsArray: ondokuSentences.map(
                  (sentence) => sentence.accents
                ),
              })
            }
            onEdit={onEdit}
            ondoku={ondoku}
          />
        </TableLayout>
      );
    } else {
      return <div />;
    }
  }
};

export default OndokuSentencesPage;
