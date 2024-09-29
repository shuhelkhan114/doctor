import { useEffect } from 'react';

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
import { formatPhone } from '@core/utils/formatter';
import { updateContactValidationSchema } from '@core/validation/doctor';
import useAppTheme from '@hooks/useTheme';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { FormikProvider, useFormik } from 'formik';
import { useMutation } from 'react-query';

type UpdateContactScreenProps = NativeStackScreenProps<
  StartStackScreens,
  Screens.UpdateContactScreen
>;

export type UpdateContactScreenParams = undefined;

const UpdateContactScreen: React.FC<UpdateContactScreenProps> = (props) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    mutate: updateProfile,
  } = useMutation(API.doctor.auth.updateProfile, {
    onSuccess() {
      toast.success('Contact information updated successfully!', undefined, undefined, 'top');
      navigation.goBack();
      dispatch(refetchDoctor());
    },
    onError() {
      toast.error('Unable to update contact information, Please try again!');
    },
  });

  const formik = useFormik({
    initialValues: { phone: '' },
    validationSchema: updateContactValidationSchema,
    validateOnMount: true,
    validateOnBlur: true,
    onSubmit(values) {
      updateProfile({
        contact: values.phone,
      });
    },
  });

  useEffect(() => {
    formik.setFieldValue('phone', auth.doctor?.contact);
  }, [auth.doctor?.contact]);

  const disabled = !formik.isValid || isLoading;

  return (
    <KeyboardView>
      <Block flex1>
        <DefaultNavigationBar title="Update Contact Information" />
        <Block pB="xxxl" justify="space-between" flex1>
          <ScrollView pT="5xl" pH="xxxl">
            <Block justify="space-between" flex1>
              <Block>
                <FormikProvider value={formik}>
                  <FormikInput
                    name="phone"
                    maxLength={14}
                    formatter={formatPhone}
                    keyboardType="phone-pad"
                    placeholder="Phone Number"
                    inputStyle={{ ...theme.shadow.sm }}
                  />

                  <ErrorText error={error} />
                </FormikProvider>
              </Block>
            </Block>
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
      </Block>
    </KeyboardView>
  );
};

export default UpdateContactScreen;
