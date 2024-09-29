import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';

interface CustomError {
  message: string;
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.error?.message;
    if (Array.isArray(message)) {
      return message.join('__#');
    } else if (typeof message === 'string') {
      return message;
    }
  } else if (error instanceof FirebaseError) {
    if (error.code === 'auth/invalid-email') {
      return 'Please enter a valid email';
    } else if (error.code === 'auth/network-request-failed') {
      return 'Unable to connect with the server, please try again.';
    } else if (error.code === 'auth/email-already-in-use') {
      return 'User with same email already exists.';
    } else if (error.code === 'auth/user-not-found') {
      return 'User not found!';
    } else if (error.code === 'auth/wrong-password') {
      return 'Incorrect password!';
    }
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else if ((error as CustomError)?.message) {
    return (error as CustomError).message;
  }
  return 'Unexpected error has occurred!';
};
