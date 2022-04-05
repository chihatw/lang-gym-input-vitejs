import React, { useEffect, useState } from 'react';

import AppRoutes from './routes/AppRoutes';
import { AppContext, useApp } from './services/app';
import { useArticles } from './services/useArticles';
import { useUsers } from './services/useUsers';
import useAudioItems from './services/useAudioItems';
import { useSentences } from './services/useSentences';

const App = () => {
  const [articleId, setArticleId] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { initializing, user, createRhythmsQuestion } = useApp();
  const { audioItems, deleteAudioItem } = useAudioItems();
  const { article, articles } = useArticles({
    opened: true,
    articleId,
    setIsFetching,
  });
  const { users } = useUsers({ opened: true });
  const { sentences } = useSentences({ articleId, sentenceId: '' });
  return (
    <AppContext.Provider
      value={{
        user,
        users,
        article,
        articles,
        sentences,
        audioItems,
        isFetching,
        initializing,
        setArticleId,
        setIsFetching,
        deleteAudioItem,
        createRhythmsQuestion,
      }}
    >
      <AppRoutes />
    </AppContext.Provider>
  );
};

export default App;
