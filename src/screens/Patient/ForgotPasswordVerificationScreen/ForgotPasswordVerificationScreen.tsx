import Block from '@components/Block/Block';
import LogoHorizontalPrimary from '@components/Icons/LogoHorizontalPrimary';
import Image from '@components/Image/Image';
import Link from '@components/Link/Link';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { gradientColors } from '@core/styles/theme';
import useAppTheme from '@hooks/useTheme';
import { AuthStackScreens } from '@navigation/AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ForgotPasswordVerificationScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.ForgotPasswordVerificationScreen
>;

export type ForgotPasswordVerificationScreenParams = undefined;

const ForgotPasswordVerificationScreen: React.FC<ForgotPasswordVerificationScreenProps> = (
  props
) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        gradient: {
          flex: 1,
          paddingTop: insets.top,
          paddingHorizontal: theme.spacing['4xl'],
        },
      }),
    []
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <Block align="center" pH="sm" flex1 pB="4xl">
        <LogoHorizontalPrimary />

        <Typography variation="title1" center mT="4xl">
          Please check your email
        </Typography>

        <Image
          mT="xxxl"
          width={172}
          height={96}
          source={require('@assets/illustrations/forgot-password-verification.png')}
        />

        <Typography variation="description1" mT="xxxl" mB="auto">
          We've sent you a password reset link
        </Typography>

        <Link center mT="5xl" onPress={() => navigation.navigate(Screens.LoginScreen)}>
          Already have an account? <Typography variation="description1Bolder">Login</Typography>
        </Link>
      </Block>
    </LinearGradient>
  );
};

export default ForgotPasswordVerificationScreen;
