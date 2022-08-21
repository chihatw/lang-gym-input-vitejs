import React, { useContext } from 'react';
import { useSignInPage } from './services/signInPage';
import { Container } from '@mui/material';
import SignInForm from '../../components/SignInForm';
import { AppContext } from '../../App';
import { Navigate } from 'react-router-dom';

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
