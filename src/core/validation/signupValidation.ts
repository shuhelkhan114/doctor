import * as Yup from 'yup';

export const signupValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'Too short first name')
    .max(200, 'Too long first name'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Too short last name')
    .max(200, 'Too long first name'),
  dob: Yup.string()
    .required('DOB is required')
    .matches(
      /^[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]$/,
      'Date of birth must be in DD-MM-YYYY format'
    ),
  gender: Yup.string().required('Gender is required!'),
  phone: Yup.string().required('Phone is required').length(14, 'Invalid phone'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Too short password')
    .max(100, 'Too long password')
    .required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
