import React from 'react';
import { useMatch } from 'react-router-dom';
import { useInitialOndokuPage } from './services/initialOndokuPage';
import OndokuSentenceInitialForm from './components/OndokuSentenceInitialForm';
import TableLayout from '../../../templates/TableLayout';

const InitialOndokuPage = () => {
  const match = useMatch('/ondoku/:id/initial');
  const {
    title,
    japanese,
    accentString,
    onChangeJapanese,
    onChangeAccentString,
    ondokuSentences,
    onSubmit,
    isValid,
  } = useInitialOndokuPage(match?.params.id || '');
  return (
    <TableLayout title={`${title} - 初期化`} backURL='/ondoku/list'>
      <OndokuSentenceInitialForm
        isValid={isValid}
        onSubmit={onSubmit}
        japanese={japanese}
        accentString={accentString}
        ondokuSentences={ondokuSentences}
        onChangeJapanese={onChangeJapanese}
        onChangeAccentString={onChangeAccentString}
      />
    </TableLayout>
  );
};

export default InitialOndokuPage;
