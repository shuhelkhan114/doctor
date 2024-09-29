import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import LogoHorizontalPrimary from '@components/Icons/LogoHorizontalPrimary';
import Image from '@components/Image/Image';
import Input from '@components/Input/Input';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import Link from '@components/Link/Link';
import ScrollView from '@components/ScrollView/ScrollView';
import StepIndicator from '@components/StepIndicator/StepIndicator';
import Typography from '@components/Typography/Typography';
import { appConfig, truDocConfig } from '@core/config/app';
import { Screens } from '@core/config/screens';
import { auth } from '@core/lib/firebase';
import toast from '@core/lib/toast';
import { gradientColors } from '@core/styles/theme';
import { isValidEmail } from '@core/utils/common';
import { logError } from '@core/utils/logger';
import useAppTheme from '@hooks/useTheme';
import { AuthStackScreens } from '@navigation/AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.ForgotPasswordScreen
>;

export type ForgotPasswordScreenParams = undefined;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = (props) => {
  const { navigation } = props;

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSend = async () => {
    try {
      setLoading(true);
      if (!isValidEmail(email.trim())) {
        setError('Invalid email address');
      } else {
        setError('');
        await sendPasswordResetEmail(auth, email.trim(), {
          url: `${truDocConfig.domain}/forgot-password?email=${email.trim()}`,
          handleCodeInApp: true,
          iOS: {
            bundleId: appConfig.ios.bundleId,
          },
          android: {
            packageName: appConfig.android.bundleId,
            installApp: true,
          },
        });
        toast.success('Reset password email sent successfully!');
        navigation.navigate(Screens.ForgotPasswordVerificationScreen);
      }
    } catch (error) {
      logError(error);
      setError(error as any);
      toast.error('Unable to send reset password email, please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardView>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <ScrollView>
          <Block align="center">
            <LogoHorizontalPrimary />
            <Typography variation="title1" center mT="4xl">
              Forgot Password?
            </Typography>
            <Image
              mT="xl"
              width={116}
              height={105}
              source={require('@assets/illustrations/forgot-password.png')}
            />
          </Block>

          <Typography variation="description1" mT="xxl">
            Enter the email address you used when you joined and we’ll send you instructions to
            reset your password.
          </Typography>

          <Typography variation="description1" mT="xl">
            For security reasons, we do NOT store your password. So rest assured that we will never
            send your password via email.
          </Typography>

          <Input
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            mT="4xl"
            placeholder="Email Address"
          />

          <ErrorText error={error} />

          <Button loading={loading} mT="6xl" title="Send Reset Instructions" onPress={handleSend} />

          <StepIndicator activeStep={1} steps={2} mT="6xl" />

          <Link center mT="5xl" onPress={() => navigation.navigate(Screens.LoginScreen)}>
            Already have an account? <Typography variation="description1Bolder">Login</Typography>
          </Link>
        </ScrollView>
      </LinearGradient>
    </KeyboardView>
  );
};

export default ForgotPasswordScreen;
