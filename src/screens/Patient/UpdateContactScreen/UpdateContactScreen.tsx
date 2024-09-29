import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormikProvider, useFormik } from 'formik';
import { StyleSheet } from 'react-native';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import FormikInput from '@components/formik/FormikInput/FormikInput';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { formatPhone } from '@core/utils/formatter';
import { editContactValidationSchema } from '@core/validation/editProfile';
import useAppTheme from '@hooks/useTheme';
import { ProfileStackScreens } from '@navigation/Patient/ProfileStack';
import { refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { useEffect, useMemo } from 'react';
import { useMutation } from 'react-query';

type UpdateContactScreenProps = NativeStackScreenProps<
  ProfileStackScreens,
  Screens.UpdateContactScreen
>;

export type UpdateContactScreenParams = undefined;

const initialValues = {
  phone_number: '',
  email: '',
};

const UpdateContactScreen: React.FC<UpdateContactScreenProps> = (props) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { isLoading, mutate: updateProfile } = useMutation(API.patient.auth.updateProfile, {
    onSuccess() {
      toast.success('Contact updated successfully');
      dispatch(refetchPatient());
      navigation.goBack();
    },
    onError() {
      toast.error('Unable to update contact, please try again!');
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema: editContactValidationSchema,
    validateOnMount: true,
    onSubmit(values, formik) {
      updateProfile(values);
    },
  });

  useEffect(() => {
    if (auth.patient) {
      formik.setValues({
        phone_number: auth.patient.phone_number,
        email: auth.patient.email,
      });
    }
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        input: {
          ...theme.shadow.sm,
          marginBottom: theme.spacing.xxl,
        },
      }),
    []
  );

  const disabled = !formik.isValid || formik.isSubmitting;

  return (
    <KeyboardView>
      <Block flex1 pB="xxxl">
        <DefaultNavigationBar title="Edit Contact Information" />

        <ScrollView pH="xxxl" pB="xl">
          <FormikProvider value={formik}>
            <Block pV="xxxl">
              <FormikInput
                maxLength={14}
                name="phone_number"
                placeholder="Phone"
                style={styles.input}
                formatter={formatPhone}
                keyboardType="phone-pad"
              />

              <FormikInput
                name="email"
                disabled
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
              />
            </Block>
          </FormikProvider>
        </ScrollView>
        <Block pH="xxxl">
          <Button
            title="Save"
            loading={isLoading}
            disabled={disabled}
            onPress={formik.submitForm}
          />
        </Block>
      </Block>
    </KeyboardView>
  );
};

export default UpdateContactScreen;
