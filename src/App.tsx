import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import SignInPage from './components/pages/SignInPage';
import TopPage from './components/pages/TopPage';
import GuestRoute from './components/routes/GuestRoute';
import PrivateRoute from './components/routes/PrivateRoute';
import { useApp, AppContext } from './services/app';
import NoMatch from './components/routes/NoMatch';
import OndokuRoute from './components/routes/OndokuRoute';
import UidOndokuRoute from './components/routes/UidOndokuRoute';
import ArticleRoute from './components/routes/ArticleRoute';
import AccentsQuestionRoute from './components/routes/AccentsQuestionRoute';
import RhythmsQuestionRoute from './components/routes/RhythmsQuestionRoute';
import SentenceRoute from './components/routes/SentenceRoute';
import BatchPage from './components/pages/BatchPage';
import AudioItemsPage from './components/pages/AudioItemsPage';
import useAudioItems from './services/useAudioItems';

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;

const AppContent = () => {
  const { initializing, user, onCreateRhythmsQuestion } = useApp();

  const { audioItems, deleteAudioItem } = useAudioItems();
  return (
    <AppContext.Provider
      value={{
        user,
        initializing,
        audioItems,
        deleteAudioItem,
        onCreateRhythmsQuestion,
      }}
    >
      <Switch>
        <PrivateRoute exact path='/' component={TopPage} />
        <PrivateRoute exact path='/batch' component={BatchPage} />
        <PrivateRoute path='/ondoku' component={OndokuRoute} />
        <PrivateRoute
          path='/accentsQuestion'
          component={AccentsQuestionRoute}
        />
        <PrivateRoute
          path='/rhythmsQuestion'
          component={RhythmsQuestionRoute}
        />
        <PrivateRoute path='/article' component={ArticleRoute} />
        <PrivateRoute path='/sentence' component={SentenceRoute} />
        <PrivateRoute path='/uidOndoku' component={UidOndokuRoute} />
        <PrivateRoute path='/audioItems' component={AudioItemsPage} />
        <GuestRoute exact path='/login' component={SignInPage} />
        <NoMatch />
      </Switch>
    </AppContext.Provider>
  );
};
