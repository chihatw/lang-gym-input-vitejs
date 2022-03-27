import React from 'react';
import { Switch } from 'react-router';
import CreateUidOndokuPage from '../pages/uidOndoku/CreateUidOndokuPage';
import UidOndokuListPage from '../pages/uidOndoku/UidOndokuListPage';
import PrivateRoute from './PrivateRoute';

const UidOndokuRoute = () => {
  return (
    <Switch>
      <PrivateRoute
        exact
        path='/uidOndoku/list'
        component={UidOndokuListPage}
      />
      <PrivateRoute path='/uidOndoku/:id' component={CreateUidOndokuPage} />
    </Switch>
  );
};

export default UidOndokuRoute;
