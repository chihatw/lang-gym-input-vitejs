import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { AppContext } from '../../services/app';

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const { user, initializing } = useContext(AppContext);
  const { component, ...rest } = props;
  return !initializing ? (
    <Route
      {...rest}
      render={() => (user ? <Route {...props} /> : <Redirect to='/login' />)}
    />
  ) : (
    <></>
  );
};

export default PrivateRoute;
