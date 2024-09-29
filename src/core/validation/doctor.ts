import * as Yup from 'yup';

export const updateContactValidationSchema = Yup.object().shape({
  phone: Yup.string().required('Phone is required').length(14, 'Invalid phone'),
});

export const updateAddressValidationSchema = Yup.object().shape({
  street: Yup.string().required('Address is required').nullable(),
  city: Yup.string().required('City is required').nullable(),
  state: Yup.string().required('State is required').nullable(),
  zip: Yup.string().required('Zip is required').nullable(),
});
