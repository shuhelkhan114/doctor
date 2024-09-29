import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import Typography from '@components/Typography/Typography';
import FormikDropdown from '@components/formik/FormikDropdown/FormikDropdown';
import FormikInput from '@components/formik/FormikInput/FormikInput';
import { states } from '@core/data/states';
import toast from '@core/lib/toast';
import API from '@core/services';
import { updateAddressValidationSchema } from '@core/validation/doctor';
import useAppTheme from '@hooks/useTheme';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useMutation } from 'react-query';

interface MonetizationAddressProps {
  closeModal: (visible: false) => void;
}

const MonetizationAddress: React.FC<MonetizationAddressProps> = (props) => {
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
      toast.success('Payment Address updated successfully');
      dispatch(refetchDoctor());
      closeModal?.(false);
    },
    onError() {
      toast.error('Unable to update address, please try again!');
    },
  });

  const formik = useFormik({
    validateOnMount: true,
    validationSchema: updateAddressValidationSchema,
    initialValues: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    onSubmit(values) {
      updateProfile({
        payment_city: values.city,
        payment_state: values.state,
        payment_street_address: values.street,
        payment_zipcode: values.zip,
      });
    },
  });

  useEffect(() => {
    if (auth.doctor) {
      formik.setValues({
        city: auth.doctor.payment_city,
        state: auth.doctor.payment_state,
        street: auth.doctor.payment_street_address,
        zip: auth.doctor.payment_zipcode,
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
            Your address
          </Typography>
          <FormikInput style={styles.input} name="street" placeholder="Street Address" />
          <FormikInput style={styles.input} name="city" placeholder="City" />
          <FormikDropdown
            name="state"
            options={states}
            placeholder="State"
            containerStyles={styles.input}
          />
          <FormikInput style={styles.input} name="zip" placeholder="Your ZIP Code" />
          <ErrorText error={error} />
        </Block>
        <Button loading={isLoading} title="Save Address" onPress={formik.submitForm} />
      </Block>
    </FormikProvider>
  );
};

export default MonetizationAddress;
