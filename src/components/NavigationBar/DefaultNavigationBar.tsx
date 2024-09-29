import React, { useMemo } from 'react';
import { StatusBar, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Block, { BlockProps } from '@components/Block/Block';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import Typography from '@components/Typography/Typography';

interface DefaultNavigationBarProps extends BlockProps {
  title: string;
  asideContent?: React.ReactNode;
}

const DefaultNavigationBar: React.FC<DefaultNavigationBarProps> = (props) => {
  const { title, asideContent, ...restProps } = props;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: insets.top,
        },
      }),
    []
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <Block style={styles.container} {...restProps} pH="xxxl">
      <StatusBar barStyle="dark-content" />
      <Block pV="xl" flexDirection="row" align="center">
        <Block pR="md" onPress={handleGoBack}>
          <ArrowLeftIcon />
        </Block>
        <Typography variation="title2Bolder">{title}</Typography>
      </Block>
      {asideContent}
    </Block>
  );
};

export default DefaultNavigationBar;
