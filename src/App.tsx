import React, { useEffect } from 'react';

import AppRoutes from './routes/AppRoutes';
import { AppContext, useApp } from './services/app';
import { useArticles } from './services/useArticles';
import useAudioItems from './services/useAudioItems';

const App = () => {
  const { initializing, user, onCreateRhythmsQuestion } = useApp();
  const { audioItems, deleteAudioItem } = useAudioItems();
  const { articles } = useArticles({ opened: true });
  useEffect(() => {
    console.log({ articles });
  }, [articles]);
  return (
    <AppContext.Provider
      value={{
        user,
        articles,
        audioItems,
        initializing,
        deleteAudioItem,
        onCreateRhythmsQuestion,
      }}
    >
      <AppRoutes />
    </AppContext.Provider>
  );
};

export default App;
