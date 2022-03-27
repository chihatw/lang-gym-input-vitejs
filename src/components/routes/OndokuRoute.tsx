import React from 'react';
import { Switch } from 'react-router';
import CreateOndokuPage from '../pages/ondoku/CreateOndokuPage';
import EditOndokuAssignmentPage from '../pages/ondoku/EditOndokuAssignmentPage';
import EditOndokuAssignmentVoicePage from '../pages/ondoku/EditOngokuAssignmentVoicePage';
import EditOndokuPage from '../pages/ondoku/EditOndokuPage';
import EditOndokuSentencePage from '../pages/ondoku/EditOndokuSentencePage';
import EditOndokuVoicePage from '../pages/ondoku/EditOndokuVoicePage';

import InitialOndokuPage from '../pages/ondoku/InitialOndokuPage';
import InitialOndokuVoicePage from '../pages/ondoku/InitialOndokuVoicePage';
import OndokuAssignmentPage from '../pages/ondoku/OndokuAssignmentPage';
import OndokuListPage from '../pages/ondoku/OndokuListPage';

import NoMatch from './NoMatch';
import PrivateRoute from './PrivateRoute';

import OndokuPage from '../pages/ondoku/OndokuPage';

const OndokuRoute = () => {
  return (
    <Switch>
      <PrivateRoute exact path='/ondoku' component={CreateOndokuPage} />
      <PrivateRoute exact path='/ondoku/list' component={OndokuListPage} />
      <PrivateRoute path='/ondoku/edit/:id' component={EditOndokuPage} />
      <PrivateRoute
        path='/ondoku/sentence/:id'
        component={EditOndokuSentencePage}
      />
      <PrivateRoute path='/ondoku/:id/initial' component={InitialOndokuPage} />
      <PrivateRoute
        path='/ondoku/:id/voice/initial'
        component={InitialOndokuVoicePage}
      />
      <PrivateRoute path='/ondoku/:id/voice' component={EditOndokuVoicePage} />
      <PrivateRoute
        path='/ondoku/:id/assignment/uid/:uid/voice/'
        component={EditOndokuAssignmentVoicePage}
      />
      <PrivateRoute
        path='/ondoku/:id/assignment/uid/:uid/line/:line'
        component={EditOndokuAssignmentPage}
      />
      <PrivateRoute
        path='/ondoku/:id/assignment'
        component={OndokuAssignmentPage}
      />
      <PrivateRoute path='/ondoku/:id' component={OndokuPage} />
      <NoMatch />
    </Switch>
  );
};

export default OndokuRoute;
