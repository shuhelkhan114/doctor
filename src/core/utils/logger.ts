import { getErrorMessage } from './apiError';

export const logError = (error: unknown) => {
  if (__DEV__) {
    const errorMessage = getErrorMessage(error);
    console.error(error);
    console.log(errorMessage);
  } else {
    // TODO: Log to third party logging service
  }
};
