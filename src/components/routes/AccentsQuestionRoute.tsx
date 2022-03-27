import React from 'react';
import { Switch } from 'react-router';
import NoMatch from './NoMatch';
import PrivateRoute from './PrivateRoute';
import AccentsQuestionListPage from '../pages/accentsQuestion/AccentsQuestionListPage';
import AccentsQuestionPage from '../pages/accentsQuestion/AccentsQuestionPage';

const AccentsQuestionRoute = () => {
  return (
    <Switch>
      <PrivateRoute
        exact
        path='/accentsQuestion/list'
        component={AccentsQuestionListPage}
      />
      <PrivateRoute
        exact
        path='/accentsQuestion/:id'
        component={AccentsQuestionPage}
      />
      <NoMatch />
    </Switch>
  );
};

export default AccentsQuestionRoute;
