import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormikProvider, useFormik } from 'formik';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import FormikInput from '@components/formik/FormikInput/FormikInput';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { editAddressValidationSchema } from '@core/validation/editProfile';
import useAppTheme from '@hooks/useTheme';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { ProfileStackScreens } from '@navigation/Patient/ProfileStack';
import { refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useMutation } from 'react-query';

type UpdateAddressScreenProps = NativeStackScreenProps<
  ProfileStackScreens | DashboardStackScreens,
  Screens.UpdateAddressScreen
>;

export type UpdateAddressScreenParams = undefined;

const initialValues = {
  address: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
};

const UpdateAddressScreen: React.FC<UpdateAddressScreenProps> = (props) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const {
    isLoading,
    error,
    mutate: updateProfile,
  } = useMutation(API.patient.auth.updateProfile, {
    onSuccess() {
      toast.success('Address updated successfully');
      dispatch(refetchPatient());
      navigation.goBack();
    },
    onError() {
      toast.error('Unable to update address, please try again!');
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema: editAddressValidationSchema,
    validateOnMount: true,
    onSubmit(values) {
      updateProfile({
        ...(values.address?.trim() === '' ? { address: null } : { address: values.address }),
        ...(values.apartment?.trim() === ''
          ? { apartment: null }
          : { apartment: values.apartment }),
        city: values.city,
        state: values.state,
        zip: values.zip,
      });
    },
  });

  useEffect(() => {
    if (auth.patient) {
      formik.setValues({
        address: auth.patient.address,
        apartment: auth.patient.apartment,
        city: auth.patient.city,
        state: auth.patient.state,
        zip: auth.patient.zip,
      });
    }
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        input: {
          marginBottom: theme.spacing.xxl,
        },
      }),
    []
  );

  const disabled = !formik.isValid || formik.isSubmitting;

  return (
    <KeyboardView>
      <Block flex1 pB="xxxl">
        <DefaultNavigationBar title="Edit Address" />

        <ScrollView keyboardShouldPersistTaps="handled">
          <FormikProvider value={formik}>
            <Block pV="xxxl" pH="xxxl">
              <FormikInput name="address" placeholder="Address" style={styles.input} />
              <FormikInput
                name="apartment"
                placeholder="Apartment, suites, etc."
                style={styles.input}
              />
              <FormikInput name="city" placeholder="City" style={styles.input} />
              <FormikInput name="state" placeholder="State" style={styles.input} />
              <FormikInput name="zip" placeholder="Zip Code" style={styles.input} />

              <ErrorText error={error} />
            </Block>
          </FormikProvider>
        </ScrollView>

        <Block pH="xxxl">
          <Button
            loading={isLoading}
            disabled={disabled}
            title="Save"
            onPress={formik.submitForm}
          />
        </Block>
      </Block>
    </KeyboardView>
  );
};

export default UpdateAddressScreen;
