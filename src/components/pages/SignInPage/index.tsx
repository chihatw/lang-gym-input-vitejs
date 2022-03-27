import React from 'react';
import SignInForm from '@bit/chihatw.lang-gym.sign-in-form';
import { useSignInPage } from './services/signInPage';
import { Container } from '@mui/material';

const SignInPage = () => {
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
