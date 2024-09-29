import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import LogoHorizontalPrimary from '@components/Icons/LogoHorizontalPrimary';
import Input from '@components/Input/Input';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import Link from '@components/Link/Link';
import Typography from '@components/Typography/Typography';
import { asyncStorageKeys } from '@core/config/asyncStorage';
import { Screens } from '@core/config/screens';
import { patientAxiosInstance } from '@core/lib/axios';
import app from '@core/lib/firebase';
import API from '@core/services';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { AuthStackScreens } from '@navigation/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { donePatientOnBoarding, fetchPatient } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LoginScreenProps = NativeStackScreenProps<AuthStackScreens, Screens.LoginScreen>;

const LoginScreen: React.FC<LoginScreenProps> = (props) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [asyncError, setAsyncError] = useState<unknown>();
  const [loggingIn, setLoggingIn] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: theme.spacing.xxxl,
          justifyContent: 'space-between',
          paddingHorizontal: getSize(40),
        },
        title: {
          // marginBottom: 'auto',
          marginTop: theme.spacing.xl,
        },
        stepIndicator: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: getSize(90),
          marginBottom: getSize(58),
        },
        activeStep: {
          width: getSize(30),
          height: getSize(5),
          borderRadius: 8,
          backgroundColor: theme.colors.accent,
          marginRight: theme.spacing.sm,
        },
        inactiveStep: {
          width: getSize(7),
          height: getSize(5),
          borderRadius: 8,
          backgroundColor: theme.colors.accent + '66',
        },
        callout: {
          fontSize: getSize(10),
          fontFamily: 'Poppins-SemiBold',
          fontWeight: '600',
          letterSpacing: 8,
          textTransform: 'uppercase',
        },
      }),
    []
  );

  const handleLogin = async () => {
    const auth = getAuth(app);
    try {
      setLoggingIn(true);
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);

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

      const token = await messaging().getToken();
      await API.patient.auth.updateProfile({
        device_tokens: [token],
      });
      dispatch(fetchPatient());
      dispatch(donePatientOnBoarding());
    } catch (error) {
      setAsyncError(error);
    } finally {
      setLoggingIn(false);
    }
  };

  const disabled = !email || !password;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flex: 1 }}>
      <KeyboardView>
        <LinearGradient colors={['#ffffff', '#DCEAFA']} style={styles.container}>
          <Block align="center">
            <LogoHorizontalPrimary />
          </Block>

          <View>
            <View>
              <Typography center style={styles.callout}>
                Welcome Back
              </Typography>
              <Typography center variation="title1">
                Login to your account
              </Typography>
            </View>

            {/* @ts-ignore */}
            <Block style={{ marginTop: 54.82 }}>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ marginTop: theme.spacing.lg }}
              />

              <ErrorText error={asyncError} />

              <Button
                disabled={disabled}
                title="Sign In"
                loading={loggingIn}
                onPress={handleLogin}
                style={{ marginTop: 28 }}
              />

              <Block onPress={() => navigation.navigate(Screens.ForgotPasswordScreen)}>
                <Typography center variation="description2" mT="lg">
                  Forgot your password??
                </Typography>
              </Block>

              <View style={styles.stepIndicator}>
                <View style={styles.activeStep} />
                <View style={styles.inactiveStep} />
              </View>

              <Link center onPress={() => navigation.navigate(Screens.SignupScreen)}>
                Don't have an account?{' '}
                <Typography variation="description2Bolder">Sign Up</Typography>
              </Link>
            </Block>
          </View>
        </LinearGradient>
      </KeyboardView>
    </ScrollView>
  );
};

export default LoginScreen;
