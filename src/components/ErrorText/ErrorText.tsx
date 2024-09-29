import React from 'react';
import { TextStyle } from 'react-native';

import Typography from '@components/Typography/Typography';
import { getErrorMessage } from '@core/utils/apiError';

interface ErrorTextProps {
  error: unknown;
  style?: TextStyle;
}

const ErrorText: React.FC<ErrorTextProps> = (props) => {
  const { error, style } = props;

  const message = getErrorMessage(error);

  if (!error) return <></>;

  return (
    <Typography color="negativeAction" mV="xl" style={style}>
      {message}
    </Typography>
  );
};

export default ErrorText;
