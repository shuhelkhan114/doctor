import * as Yup from 'yup';

export const editAddressValidationSchema = Yup.object().shape({
  city: Yup.string().required('City is required!'),
  state: Yup.string().required('State is required!'),
  zip: Yup.string().required('Zip Code is required!'),
});

export const editContactValidationSchema = Yup.object().shape({
  phone_number: Yup.string().required('Phone is required!'),
  email: Yup.string().required('Email is required!'),
});

export const editDOBValidationSchema = Yup.object().shape({
  date_of_birth: Yup.string().required('Address is required!'),
});
