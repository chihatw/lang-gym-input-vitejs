import React from 'react';
import { Switch } from 'react-router';
import EditArticleSentencePage from '../pages/article/EditArticleSentencePage';
import EditSentenceParsePage from '../pages/sentenceParse/EditSentenceParsePage';
import NoMatch from './NoMatch';
import PrivateRoute from './PrivateRoute';

const SentenceRoute = () => {
  return (
    <Switch>
      <PrivateRoute
        path='/sentence/:id/parse'
        component={EditSentenceParsePage}
      />
      <PrivateRoute path='/sentence/:id' component={EditArticleSentencePage} />
      <NoMatch />
    </Switch>
  );
};

export default SentenceRoute;
