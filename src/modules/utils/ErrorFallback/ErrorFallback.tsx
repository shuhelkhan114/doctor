import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import LogoHorizontalPrimary from '@components/Icons/LogoHorizontalPrimary';
import Typography from '@components/Typography/Typography';
import React from 'react';
import RNRestart from 'react-native-restart';

interface ErrorFallbackProps {}

const ErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
  const handleRestart = () => {
    RNRestart.restart();
  };

  return (
    <Block flex1 justify="center" align="center" pH="xxxl">
      <LogoHorizontalPrimary />
      <Typography mV="xxxl">Unexpected error has occurred!</Typography>
      <Button title="Re-open App" onPress={handleRestart} />
    </Block>
  );
};

export default ErrorFallback;
