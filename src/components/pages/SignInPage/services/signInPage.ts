import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../../../repositories/firebase';

export const useSignInPage = () => {
  const [emailErrMsg, setEmailErrMsg] = useState<string>('');
  const [passwordErrMsg, setPasswordErrMsg] = useState<string>('');

  const resetErrMsg = () => {
    setEmailErrMsg('');
    setPasswordErrMsg('');
  };

  const onSignIn = async (email: string, password: string) => {
    const { error } = await onSignInMail(email, password);
    setEmailErrMsg(error.emailErrMsg);
    setPasswordErrMsg(error.passwordErrMsg);
  };

  return {
    emailErrMsg,
    passwordErrMsg,
    resetErrMsg,
    onSignIn,
  };
};

const onSignInMail = async (
  email: string,
  password: string
): Promise<{
  success?: boolean;
  error?: any;
}> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, error: { emailErrMsg: '', passwordErrMsg: '' } };
  } catch (error) {
    let emailErrMsg = 'サインインできませんでした。';
    let passwordErrMsg = 'サインインできませんでした。';
    switch ((error as any).code) {
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        emailErrMsg = 'メールアドレスが間違っています。';
        passwordErrMsg = '';
        break;
      case 'auth/wrong-password':
        emailErrMsg = '';
        passwordErrMsg = 'パスワードが間違っています。';
        break;
      default:
    }
    return { error: { emailErrMsg, passwordErrMsg } };
  }
};
