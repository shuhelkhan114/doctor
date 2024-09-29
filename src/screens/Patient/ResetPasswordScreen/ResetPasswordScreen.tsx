import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

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
import { asyncStorageKeys } from '@core/config/asyncStorage';
import { Screens } from '@core/config/screens';
import { patientAxiosInstance } from '@core/lib/axios';
import { auth } from '@core/lib/firebase';
import toast from '@core/lib/toast';
import { gradientColors } from '@core/styles/theme';
import { getErrorMessage } from '@core/utils/apiError';
import useAppTheme from '@hooks/useTheme';
import { AuthStackScreens } from '@navigation/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { donePatientOnBoarding, fetchPatient } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import { LinearGradient } from 'expo-linear-gradient';
import {
  confirmPasswordReset,
  signInWithEmailAndPassword,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ResetPasswordScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.ResetPasswordScreen
>;

export type ResetPasswordScreenParams = {
  link: string;
};

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = (props) => {
  const { navigation, route } = props;
  const { link } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
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

  const handleReset = async () => {
    try {
      setLoading(true);
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
      } else if (password !== confirmPassword) {
        setError('Passwords do not match');
      } else {
        const url = new URLSearchParams(link);
        const oobCode = url.get('oobCode') as string;
        const continueUrl = new URL(url.get('continueUrl') as string);
        const email = new URLSearchParams(continueUrl.search).get('email') as string;

        await verifyPasswordResetCode(auth, oobCode);
        await confirmPasswordReset(auth, oobCode, password);
        const res = await signInWithEmailAndPassword(auth, email, password);

        await AsyncStorage.setItem(
          asyncStorageKeys.FIREBASE_PATIENT_TOKENS,
          JSON.stringify({
            accessToken: (res.user as any).accessToken,
            refreshToken: res.user.refreshToken,
          })
        );

        patientAxiosInstance.defaults.headers.common.Authorization = `Bearer ${
          (res.user as any).accessToken
        }`;
        dispatch(fetchPatient());
        dispatch(donePatientOnBoarding());
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error('Unable to reset password, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardView>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <ScrollView>
          <Block align="center" pH="sm" pB="4xl">
            <LogoHorizontalPrimary />

            <Typography variation="title1" center mT="4xl">
              Reset Password
            </Typography>

            <Image
              mT="xxxl"
              width={111}
              height={104}
              source={require('@assets/illustrations/reset-password.png')}
            />
          </Block>

          <Block flex1 mB="4xl">
            <Input
              type="password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
            />

            <Input
              type="password"
              mT="xxxl"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
            />

            {error && <ErrorText error={{ message: error }} />}

            <Button loading={loading} mT="6xl" title="Reset Password" onPress={handleReset} />

            <StepIndicator mT="5xl" activeStep={1} steps={2} mB="auto" />

            <Link center mT="5xl" onPress={() => navigation.navigate(Screens.LoginScreen)}>
              Already have an account? <Typography variation="description1Bolder">Login</Typography>
            </Link>
          </Block>
        </ScrollView>
      </LinearGradient>
    </KeyboardView>
  );
};

export default ResetPasswordScreen;
