import React from 'react';
import { Switch } from 'react-router';
import NoMatch from './NoMatch';
import PrivateRoute from './PrivateRoute';
import RhythmsQuestionListPage from '../pages/rhythmsQuestion/RhythmsQuestionListPage';
import RhythmsQuestionPage from '../pages/rhythmsQuestion/RhythmsQuestionPage';

const RhythmsQuestionRoute = () => {
  return (
    <Switch>
      <PrivateRoute
        exact
        path='/rhythmsQuestion/list'
        component={RhythmsQuestionListPage}
      />
      <PrivateRoute
        exact
        path='/rhythmsQuestion/:id'
        component={RhythmsQuestionPage}
      />
      <NoMatch />
    </Switch>
  );
};

export default RhythmsQuestionRoute;
