import * as Yup from 'yup';

export const addMedicationSchema = Yup.object().shape({
  id: Yup.string().required('Medication id is required'),
  name: Yup.string().required('Medication name is required'),
  dosageAmount: Yup.number().required('Dosage is required'),
  dosageUnit: Yup.string().required('Dosage unit is required'),
  frequency: Yup.string().required('Frequency is required'),
  drugBankId: Yup.string().required('Drug Bank ID is required'),
});

export const addHealthIssueSchema = Yup.object().shape({
  name: Yup.string().required('Medication name is required'),
  severity: Yup.string().required('Dosage is required'),
});
