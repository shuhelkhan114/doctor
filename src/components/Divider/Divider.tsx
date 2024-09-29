import Block, { BlockProps } from '@components/Block/Block';
import useAppTheme from '@hooks/useTheme';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';

interface DividerProps extends BlockProps {}

const Divider: React.FC<DividerProps> = (props) => {
  const { style, ...restProps } = props;

  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        default: {
          width: '100%',
          height: 1,
          backgroundColor: '#EAEAEA',
          ...style,
        },
      }),
    []
  );

  return <Block style={styles.default} {...restProps} />;
};

export default Divider;
