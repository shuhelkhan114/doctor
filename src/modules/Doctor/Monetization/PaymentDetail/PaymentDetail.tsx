import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import Typography from '@components/Typography/Typography';
import FormikDropdown from '@components/formik/FormikDropdown/FormikDropdown';
import FormikInput from '@components/formik/FormikInput/FormikInput';
import { paymentMethodOptions } from '@core/config/dropdownOptions';
import toast from '@core/lib/toast';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

interface PaymentDetailProps {
  closeModal?: (visible: false) => void;
}

enum Fields {
  paymentMethod = 'paymentMethod',
  paypalId = 'paypalId',
  venmoEmail = 'venmoEmail',
}

export const updatePaymentMethodSchema = Yup.object().shape({
  [Fields.paymentMethod]: Yup.string().required('Payment method is required'),
  [Fields.paypalId]: Yup.string()
    .when('paymentMethod', {
      is: 'paypal',
      then: Yup.string().required('Paypal ID is required'),
    })
    .nullable(),
  [Fields.venmoEmail]: Yup.string()
    .when('paymentMethod', {
      is: 'venmo',
      then: Yup.string().required('Venmo email is required'),
    })
    .nullable(),
});

const PaymentDetail: React.FC<PaymentDetailProps> = (props) => {
  const { closeModal } = props;

  const dispatch = useAppDispatch();
  const theme = useAppTheme();

  const auth = useAppSelector((state) => state.auth);

  const {
    isLoading,
    error,
    mutate: updateProfile,
  } = useMutation(API.doctor.auth.updateProfile, {
    onSuccess() {
      toast.success('Payment Details updated successfully');
      dispatch(refetchDoctor());
      closeModal?.(false);
    },
    onError() {
      toast.error('Unable to update payment details, please try again!');
    },
  });

  const formik = useFormik({
    validateOnMount: true,
    validationSchema: updatePaymentMethodSchema,
    initialValues: {
      [Fields.paymentMethod]: '',
      [Fields.paypalId]: '',
      [Fields.venmoEmail]: '',
    },
    onSubmit(values) {
      updateProfile({
        payment_method: values.paymentMethod,
        ...(values.paymentMethod === 'PayPal' && {
          paypal_payment_id: values.paypalId,
        }),
        ...(values.paymentMethod === 'Venmo' && {
          venmo_payment_id: values.venmoEmail,
        }),
      });
    },
  });

  useEffect(() => {
    if (auth.doctor) {
      formik.setValues({
        [Fields.paymentMethod]: auth.doctor.payment_method,
        [Fields.paypalId]: auth.doctor.paypal_payment_id,
        [Fields.venmoEmail]: auth.doctor.venmo_payment_id,
      });
    }
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        input: {
          marginBottom: theme.spacing.xl,
        },
      }),
    []
  );

  return (
    <FormikProvider value={formik}>
      <Block justify="space-between" flex1>
        <Block>
          <Typography mB="xxxl" variation="title2Bolder">
            Set Payment Details
          </Typography>
          <FormikDropdown
            options={paymentMethodOptions}
            containerStyles={styles.input}
            name={Fields.paymentMethod}
            placeholder="How would you like to get paid?"
          />
          {formik.values[Fields.paymentMethod] === 'PayPal' && (
            <FormikInput
              style={styles.input}
              name={Fields.paypalId}
              placeholder="Please enter your PayPal ID"
            />
          )}

          {formik.values[Fields.paymentMethod] === 'Venmo' && (
            <FormikInput
              style={styles.input}
              name={Fields.venmoEmail}
              placeholder="Please enter your Venmo ID"
            />
          )}

          <ErrorText error={error} />
        </Block>
        <Button loading={isLoading} title="Save Payment Details" onPress={formik.submitForm} />
      </Block>
    </FormikProvider>
  );
};

export default PaymentDetail;
