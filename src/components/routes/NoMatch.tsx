import { Redirect, Route } from 'react-router';

const NoMatch = () => {
  return <Route path='*' render={() => <Redirect to='/' />} />;
};

export default NoMatch;
