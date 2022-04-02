import React, { useEffect, useState } from 'react';

import AppRoutes from './routes/AppRoutes';
import { AppContext, useApp } from './services/app';
import { useArticles } from './services/useArticles';
import { useUsers } from './services/useUsers';
import useAudioItems from './services/useAudioItems';

const App = () => {
  const [articleId, setArticleId] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { initializing, user, onCreateRhythmsQuestion } = useApp();
  const { audioItems, deleteAudioItem } = useAudioItems();
  const { article, articles } = useArticles({
    opened: true,
    articleId,
    setIsFetching,
  });
  const { users } = useUsers({ opened: true });
  return (
    <AppContext.Provider
      value={{
        user,
        users,
        article,
        articles,
        audioItems,
        isFetching,
        initializing,
        setArticleId,
        setIsFetching,
        deleteAudioItem,
        onCreateRhythmsQuestion,
      }}
    >
      <AppRoutes />
    </AppContext.Provider>
  );
};

export default App;
