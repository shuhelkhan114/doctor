import useAppTheme from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Block from '../Block/Block';
import Icon from '../Icon/Icon';
import Typography from '../Typography/Typography';

interface NavigationBarProps {
  title: string;
  variation?: 'default' | 'onboarding' | 'onboarding2' | 'transparent';
}

const NavigationBar: React.FC<NavigationBarProps> = (props) => {
  const { title, variation = 'default' } = props;
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.addListener('focus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }, [navigation]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (variation === 'onboarding') {
    return (
      <Block
        style={{ paddingTop: insets.top }}
        flexDirection="row"
        pH="4xl"
        align="center"
        justify="space-between">
        <Block onPress={handleGoBack}>
          <Icon name="chevron-left-encircled" size={30} />
        </Block>
        <Typography variation="title2Bolder">{title}</Typography>
        <Block />
      </Block>
    );
  }

  if (variation === 'onboarding2') {
    return (
      <Block
        style={{ paddingTop: insets.top }}
        flexDirection="row"
        pH="4xl"
        align="center"
        justify="space-between">
        <Block onPress={handleGoBack}>
          <Icon size={30} color={theme.colors.white} name="chevron-left-encircled" />
        </Block>
        <Typography style={{ color: '#F5F9FE' }} variation="title2Bolder">
          {title}
        </Typography>
        <Block />
      </Block>
    );
  }

  return (
    <Block
      style={{ paddingTop: insets.top }}
      bgColor={variation === 'transparent' ? undefined : 'mainBlue'}>
      <Block pH="xxxl" pB="xxl" flexDirection="row" align="center">
        <Block pR="xl" onPress={handleGoBack}>
          <Icon
            name="arrow-left"
            size={24}
            color={variation === 'transparent' ? theme.colors.text : undefined}
          />
        </Block>
        <Typography
          color={variation === 'transparent' ? undefined : 'white'}
          variation="title2Bolder">
          {title}
        </Typography>
      </Block>
    </Block>
  );
};

export default NavigationBar;
