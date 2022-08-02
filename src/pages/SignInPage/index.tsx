import React from 'react';
import { useSignInPage } from './services/signInPage';
import { Container } from '@mui/material';
import SignInForm from '../../components/SignInForm';
import { State } from '../../Model';
import { Action } from '../../Update';

const SignInPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { emailErrMsg, passwordErrMsg, resetErrMsg, onSignIn } =
    useSignInPage();
  return (
    <Container maxWidth='xs'>
      <div style={{ marginTop: 120 }}>
        <SignInForm
          emailErrMsg={emailErrMsg}
          passwordErrMsg={passwordErrMsg}
          resetErrMsg={resetErrMsg}
          onSignIn={onSignIn}
        />
      </div>
    </Container>
  );
};

export default SignInPage;
