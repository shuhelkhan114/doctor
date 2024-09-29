import Block, { BlockProps } from '@components/Block/Block';
import useAppTheme from '@hooks/useTheme';
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface SpinnerProps extends BlockProps {}

const Spinner: React.FC<SpinnerProps> = (props) => {
  const theme = useAppTheme();

  return (
    <Block flex1 justify="center" align="center" {...props}>
      <ActivityIndicator color={theme.colors.mainBlue} />
    </Block>
  );
};

export default Spinner;
