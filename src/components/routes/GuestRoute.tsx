import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { AppContext } from '../../services/app';

const GuestRoute: React.FC<RouteProps> = (props) => {
  const { user, initializing } = useContext(AppContext);
  const { component, ...rest } = props;
  return !initializing ? (
    <Route
      {...rest}
      render={() => (!!user ? <Redirect to='/' /> : <Route {...props} />)}
    />
  ) : (
    <></>
  );
};

export default GuestRoute;
