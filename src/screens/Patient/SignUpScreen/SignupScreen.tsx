import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import NavigationBar from '@components/NavigationBar/NavigationBar';
import Typography from '@components/Typography/Typography';
import FormikDateInput from '@components/formik/FormikDateInput/FormikDateInput';
import FormikDropdown from '@components/formik/FormikDropdown/FormikDropdown';
import FormikInput from '@components/formik/FormikInput/FormikInput';
import { appConfig, truDocConfig } from '@core/config/app';
import { asyncStorageKeys } from '@core/config/asyncStorage';
import { genderOptions } from '@core/config/dropdownOptions';
import { Screens } from '@core/config/screens';
import { patientAxiosInstance } from '@core/lib/axios';
import { auth } from '@core/lib/firebase';
import API from '@core/services';
import { gradientColors } from '@core/styles/theme';
import { getImageUrl } from '@core/utils/common';
import { formatPhone } from '@core/utils/formatter';
import { logError } from '@core/utils/logger';
import { getSize } from '@core/utils/responsive';
import { signupValidationSchema } from '@core/validation/signupValidation';
import useAppTheme from '@hooks/useTheme';
import { AuthStackScreens } from '@navigation/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { login, updatePatient } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { User, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { FormikProvider, useFormik } from 'formik';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useMutation } from 'react-query';

const tmpRandomNumber = Date.now().toString().split('').reverse().join('').slice(0, 10);

const initialValues = {
  firstName: __DEV__ ? 'test' : '',
  lastName: __DEV__ ? 'user' : '',
  dob: __DEV__ ? '20-04-2023' : '',
  gender: __DEV__ ? 'male' : '',
  phone: __DEV__ ? formatPhone(tmpRandomNumber) : '',
  email: __DEV__ ? `${tmpRandomNumber}.dochello@gmail.com` : '',
  password: __DEV__ ? '123456' : '',
  confirmPassword: __DEV__ ? '123456' : '',
};

type SignupScreenProps = NativeStackScreenProps<AuthStackScreens, Screens.SignupScreen>;

export type SignupScreenParams = undefined;

const SignupScreen: React.FC<SignupScreenProps> = (props) => {
  const { navigation } = props;
  const [asyncError, setAsyncError] = useState<unknown | undefined>(undefined);
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const mutation = useMutation(API.patient.auth.patientSignUp);

  const formik = useFormik({
    initialValues,
    validationSchema: signupValidationSchema,
    validateOnMount: true,
    async onSubmit(values, formik) {
      try {
        formik.setSubmitting(true);
        const { email, firstName, lastName, dob, password, phone, gender } = values;
        const token = await messaging().getToken();
        console.log({
          email,
          password,
          gender,
          last_name: lastName.trim(),
          date_of_birth: dob,
          phone_number: phone,
          linked_my_chart: false,
          device_tokens: [token],
          first_name: firstName.trim(),
          patient_image: getImageUrl(firstName.trim(), lastName.trim()),
        });
        const signUpResponse = await mutation.mutateAsync({
          email,
          password,
          gender,
          last_name: lastName.trim(),
          date_of_birth: dob,
          phone_number: phone,
          linked_my_chart: false,
          device_tokens: [token],
          first_name: firstName.trim(),
          patient_image: getImageUrl(firstName.trim(), lastName.trim()),
        });

        const firebaseAuthRes = await signInWithEmailAndPassword(auth, email, password);

        await sendEmailVerification(auth.currentUser as User, {
          url: `${truDocConfig.domain}/verify-email?email=${email}`,
          iOS: {
            bundleId: appConfig.ios.bundleId,
          },
          android: {
            packageName: appConfig.android.bundleId,
            installApp: true,
          },
        });

        await AsyncStorage.setItem(
          asyncStorageKeys.FIREBASE_PATIENT_TOKENS,
          JSON.stringify({
            accessToken: (firebaseAuthRes.user as any).accessToken,
            refreshToken: firebaseAuthRes.user.refreshToken,
          })
        );

        patientAxiosInstance.defaults.headers.common.Authorization = `Bearer ${
          (firebaseAuthRes.user as any).accessToken
        }`;

        dispatch(updatePatient(signUpResponse));
        dispatch(login());
        formik.resetForm();

        navigation.navigate(Screens.GaeaWelcomeScreen);
      } catch (error) {
        setAsyncError(error);
        logError(error);
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
        },
        title: {
          marginBottom: 'auto',
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

  const { values, setFieldValue, isSubmitting } = formik;

  const disabled = formik.isSubmitting;

  return (
    <FormikProvider value={formik}>
      <LinearGradient colors={gradientColors} style={styles.container}>
        <NavigationBar variation="onboarding" title="Welcome to Doc Hello" />

        <KeyboardView>
          <ScrollView
            testID="signup-screen"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: theme.spacing['4xl'] }}>
            <Block>
              <Typography center variation="title1" style={{ marginTop: getSize(62) }}>
                Let's get started
              </Typography>
            </Block>

            <Block pH="4xl" mT="4xl">
              <FormikInput
                name="firstName"
                placeholder="First Name"
                autoCapitalize="words"
                style={{ marginBottom: theme.spacing.xxl }}
              />
              <FormikInput
                name="lastName"
                placeholder="Last Name"
                autoCapitalize="words"
                style={{ marginBottom: theme.spacing.xxl }}
              />
              <FormikDateInput
                name="dob"
                dateFormat="dd-MM-yyyy"
                maxDate={new Date()}
                placeholder="Date of Birth"
                style={{ marginBottom: theme.spacing.xxxl }}
              />
              <FormikDropdown
                pV="xxl"
                name="gender"
                bgColor="white"
                placeholder="Gender"
                options={genderOptions}
                containerStyles={{ marginBottom: theme.spacing.xxxl }}
              />
              <FormikInput
                name="phone"
                placeholder="Mobile Phone"
                keyboardType="phone-pad"
                maxLength={14}
                style={{ marginBottom: theme.spacing.xxl }}
                formatter={formatPhone}
              />
              <FormikInput
                name="email"
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginBottom: theme.spacing.xxl }}
              />
              <FormikInput
                name="password"
                type="password"
                placeholder="Password"
                style={{ marginBottom: theme.spacing.xxl }}
              />
              <FormikInput
                name="confirmPassword"
                type="password"
                style={{
                  marginBottom: asyncError ? undefined : theme.spacing.xxl,
                }}
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={(value) => setFieldValue('confirmPassword', value)}
              />

              {!!asyncError && <ErrorText error={asyncError} />}

              <Button
                title="Confirm"
                disabled={disabled}
                loading={isSubmitting}
                onPress={formik.submitForm}
              />
            </Block>
          </ScrollView>
        </KeyboardView>
      </LinearGradient>
    </FormikProvider>
  );
};

export default SignupScreen;
