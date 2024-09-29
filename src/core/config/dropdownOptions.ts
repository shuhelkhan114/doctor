import { DropDownOption } from '@components/DropDown/DropDown';

export const genderOptions: DropDownOption[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Others', value: 'others' },
];

export const paymentMethodOptions: DropDownOption[] = [
  { label: 'Check by mail to my office address', value: 'Check by mail to my office address' },
  { label: 'Paypal', value: 'PayPal' },
  { label: 'Venmo', value: 'Venmo' },
];

export const doctorAvailabilityOptions: DropDownOption[] = [
  { label: 'Yes', value: 'ACCEPTING' },
  { label: 'No', value: 'NOT_ACCEPTING' },
  { label: 'Only via Doc Hello Referral', value: 'ONLY_VIA_REFERAL' },
];

export const patientsSortDropdownOptions: DropDownOption[] = [
  {
    label: 'Newest',
    value: 'created_at-DESC',
  },
  {
    label: 'Oldest',
    value: 'created_at-ASC',
  },
  {
    label: 'Name A-Z',
    value: 'first_name-ASC',
  },
  {
    label: 'Name Z-A',
    value: 'first_name-DESC',
  },
];
