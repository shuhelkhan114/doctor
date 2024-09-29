import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Block from '@components/Block/Block';
import Typography from '@components/Typography/Typography';

interface StaticNavigationBarProps {
  title: string;
  actionContent?: React.ReactNode;
}

const StaticNavigationBar: React.FC<StaticNavigationBarProps> = (props) => {
  const { title, actionContent } = props;
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: insets.top,
        },
      }),
    []
  );

  return (
    <Block style={styles.container}>
      <Block pH="xxxl" pV="xl" flexDirection="row" align="center" justify="space-between">
        <Typography variation="title1">{title}</Typography>
        {actionContent}
      </Block>
    </Block>
  );
};

export default StaticNavigationBar;
