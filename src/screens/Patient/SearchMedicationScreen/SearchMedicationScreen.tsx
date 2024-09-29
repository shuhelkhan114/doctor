import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Chip from '@components/Chip/Chip';
import DropDown from '@components/DropDown/DropDown';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import Image from '@components/Image/Image';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import NavigationBar from '@components/NavigationBar/NavigationBar';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { medicationPricingRange } from '@core/config/app';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { getSize } from '@core/utils/responsive';
import { addMedicationSchema } from '@core/validation/addMedication';
import useDebounce from '@hooks/useDebounce';
import useAppTheme from '@hooks/useTheme';
import MedicationSearchItem from '@modules/Shared/AddMedication/MedicationSearchItem/MedicationSearchItem';
import { AuthStackScreens } from '@navigation/AuthStack';
import { MyHealthStackScreens } from '@navigation/Patient/MyHealthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { refetchDoctor, refetchPatient } from '@store/slices/authSlice';
import { addMedication } from '@store/slices/patientOnboardingSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { Drug } from '@typings/drugbank/index';
import { Medication } from '@typings/model/medication';
import { FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type SearchMedicationScreenProps = NativeStackScreenProps<
  AuthStackScreens | MyHealthStackScreens,
  Screens.SearchMedicationScreen
>;

export type SearchMedicationScreenParams =
  | {
      patient?: {
        id: string;
        name: string;
        imageUrl: string;
      };
      onboarding?: boolean;
      from?: 'DOCTOR' | 'PATIENT';
      isEdit?: boolean;
      medication?: Medication;
    }
  | undefined;

const initialValues = {
  id: '',
  name: '',
  dosageAmount: null,
  drugBankId: null,
  dosageUnit: '',
  frequency: '',
  priceRange: '',
};

const SearchMedicationScreen: React.FC<SearchMedicationScreenProps> = (props) => {
  const { navigation, route } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Drug>();
  const { onboarding, from = 'PATIENT', patient, medication, isEdit } = route.params || {};
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const debouncedSearch = useDebounce(searchTerm, 500);

  const frequencies = useAppSelector((state) => state.auth.config.medication_frequecny);

  const {
    isLoading: addingMedicationByDoctor,
    error: medicationDoctorAddError,
    mutate: addMedicationByDoctor,
  } = useMutation(API.doctor.medication.addMedication, {
    onSuccess() {
      handleApiSuccess();
      dispatch(refetchDoctor());
      queryClient.refetchQueries(['doctor/patient', patient?.id]);
    },
    onError() {
      handleApiError();
    },
  });

  const { isLoading: addingMedicationByPatient, mutate: addMedicationByPatient } = useMutation(
    API.patient.medication.addMedication,
    {
      onSuccess() {
        handleApiSuccess();
        dispatch(refetchPatient());
      },
      onError() {
        handleApiError();
      },
    }
  );

  const { isLoading: updatingMedicationByDoctor, mutate: updateMedicationByDoctor } = useMutation(
    API.doctor.medication.updateMedication,
    {
      onSuccess() {
        handleApiSuccess();
        dispatch(refetchDoctor());
        queryClient.refetchQueries(['doctor/patient', patient?.id]);
      },
      onError() {
        handleApiError();
      },
    }
  );

  const { isLoading: updatingMedicationByPatient, mutate: updateMedicationByPatient } = useMutation(
    API.patient.medication.updateMedication,
    {
      onSuccess() {
        handleApiSuccess();
        dispatch(refetchPatient());
      },
      onError() {
        handleApiError();
      },
    }
  );

  const {
    isLoading: fetchingMedications,
    isError: fetchingMedicationsError,
    data: medications,
  } = useQuery(
    ['drugBank/drug_names', debouncedSearch],
    () => API.drugbank.searchMedications(searchTerm),
    {
      enabled: !!searchTerm,
      onError: () => {
        toast.error('Unable to fetch medication, please try again!');
      },
    }
  );

  const formik = useFormik({
    initialValues: isEdit
      ? {
          id: medication?.id,
          name: medication?.name,
          dosageAmount: medication?.dosage.split(' ')[0],
          drugBankId: medication?.drugbank_id,
          dosageUnit: medication?.dosage.split(' ')[1],
          frequency: medication?.frequency,
          priceRange: medication?.price_range,
        }
      : initialValues,
    enableReinitialize: true,
    validationSchema: addMedicationSchema,
    validateOnMount: true,
    onSubmit(values) {
      if (onboarding) {
        dispatch(addMedication({ ...values, status: 'confirmed' } as any));
        navigation.goBack();
        return;
      }

      if (from === 'PATIENT') {
        if (isEdit) {
          updateMedicationByPatient({
            medicationId: medication?.id!,
            updates: {
              frequency: values.frequency,
              price_range: values.priceRange,
            },
          });
        } else {
          addMedicationByPatient([
            {
              name: values.name!,
              frequency: values.frequency,
              price_range: values.priceRange,
              drugbank_id: values.drugBankId!,
              dosage: `${values.dosageAmount} ${values.dosageUnit}`,
            },
          ]);
        }
      } else if (from === 'DOCTOR') {
        if (isEdit) {
          updateMedicationByDoctor({
            patientId: patient?.id!,
            medicationId: medication?.id!,
            updates: {
              frequency: values.frequency,
            },
          });
        } else {
          addMedicationByDoctor({
            patientId: patient?.id!,
            params: {
              name: values.name!,
              dosage: `${values.dosageAmount} ${values.dosageUnit}`,
              drugbank_id: values.drugBankId!,
              frequency: values.frequency!,
            },
          });
        }
      }
    },
  });

  useEffect(() => {
    return () => {
      setSearchTerm('');
    };
  }, []);

  const handleApiSuccess = () => {
    toast.success(`Medication added successfully`);
    navigation.goBack();
  };

  const handleApiError = () => {
    toast.error(`Unable to add medication, please try again!`);
  };

  const handleSearch = (term: string) => {
    formik.resetForm();
    setSearchTerm(term);
  };

  useEffect(() => {
    if (searchTerm === '') {
      formik.resetForm();
    }
  }, [searchTerm]);

  let content: React.ReactNode = null;

  if (fetchingMedications) {
    content = (
      <Block flex1 align="center" justify="center">
        <ActivityIndicator />
      </Block>
    );
  } else if (fetchingMedicationsError) {
    content = (
      <Block>
        <Typography>Unable to fetch medications!</Typography>
      </Block>
    );
  } else if (medications?.length! < 1) {
    content = (
      <Block>
        <Typography>No medications found!</Typography>
      </Block>
    );
  } else if (medications?.length! > 0 && searchTerm && !formik.values.name) {
    content = medications?.map((medicine, index) => {
      const handleMedicationPress = () => {
        setSelectedMedicine(medicine);
        formik.setFieldValue('id', (Math.random() + 1).toString(36).substring(7));
        formik.setFieldValue('name', medicine.name);
        formik.setFieldValue('dosageUnit', medicine.strength.unit);
        formik.setFieldValue('dosageAmount', medicine.strength.number);
        formik.setFieldValue('drugBankId', medicine.ndc_product_codes?.[0]);
        queryClient.setQueryData('drugBank/drug_names', () => {
          return [];
        });
      };

      return (
        <MedicationSearchItem
          status={medicine.dosage_form}
          onPress={handleMedicationPress}
          key={medicine.ndc_product_codes[0]}
          bottomBorder={medications?.length - 1 !== index}
          name={`${medicine.name} (${medicine.strength.number} ${medicine.strength.unit})`}
        />
      );
    });
  }

  const { values } = formik;
  const disabled = !formik.isValid || formik.isSubmitting;

  return (
    <KeyboardView>
      <FormikProvider value={formik}>
        {from === 'PATIENT' ? (
          <NavigationBar variation="transparent" title="Search medication" />
        ) : (
          <PrimaryNavigationBar>
            <Block pH="xxxl" pB="xl" flexDirection="row" align="center">
              <Block pR="md" onPress={navigation.goBack}>
                <ArrowLeftIcon fill="white" />
              </Block>
              <Image mR="md" uri={patient?.imageUrl} size={48} circular />
              <Block>
                <Typography variation="title3Bolder" color="white">
                  {isEdit ? 'Edit' : 'Add'} Medication
                </Typography>
                <Typography
                  variation="description1"
                  color="white"
                  style={{ marginTop: getSize(-4) }}>
                  {patient?.name}
                </Typography>
              </Block>
            </Block>
          </PrimaryNavigationBar>
        )}

        <Block pH="xxxl" pV={from === 'DOCTOR' ? 'xxxl' : undefined} pB="lg">
          {isEdit ? (
            <Typography variation="title2" mL="md">
              {medication?.name}
            </Typography>
          ) : (
            <Search
              value={values.name}
              onSearch={handleSearch}
              onClear={setSearchTerm}
              placeholder="Search for medication"
            />
          )}
        </Block>

        <ScrollView height={values.name ? '100%' : 'auto'}>
          <Block pH="xxxl" mT="xs" flexDirection="column" pB="md" flex1 height="100%">
            <Block mB="auto">
              {content}

              {((values.name && searchTerm && values.dosageAmount) || isEdit) && (
                <Block>
                  <Typography variation="title3" mL="md">
                    Frequency
                  </Typography>
                  <DropDown
                    placeholder="Select"
                    value={values.frequency}
                    style={{ marginTop: theme.spacing.md }}
                    onSelect={(value) => formik.setFieldValue('frequency', value)}
                    renderTitle={() => (
                      <Typography>
                        {from === 'PATIENT' ? (
                          'How many times a day do you want to take it?'
                        ) : (
                          <Typography variation="description1">
                            How often should {patient?.name} take{`\n`}
                          </Typography>
                        )}
                        <Typography variation="title3Bolder">{values.name}</Typography>
                      </Typography>
                    )}
                    options={frequencies.map((freq) => ({
                      label: freq.value,
                      value: freq.value,
                    }))}
                  />
                </Block>
              )}

              {values.frequency && from !== 'DOCTOR' && (
                <Block mT="xxxl">
                  <Typography variation="title3" mL="md">
                    How expensive is this medication?
                  </Typography>
                  <Block flexDirection="row" justify="space-between" style={{ flexWrap: 'wrap' }}>
                    {medicationPricingRange.map((price) => (
                      <Chip
                        key={price}
                        text={price}
                        selected={price === values.priceRange}
                        onPress={() => formik.setFieldValue('priceRange', price)}
                      />
                    ))}
                  </Block>
                </Block>
              )}
            </Block>

            {values.name && (
              <Button
                mB="xl"
                iconColor="white"
                disabled={disabled}
                onPress={formik.submitForm}
                icon={!isEdit ? 'add' : undefined}
                title={`${isEdit ? 'Update' : 'Add'} Medication`}
                loading={
                  addingMedicationByDoctor ||
                  updatingMedicationByDoctor ||
                  addingMedicationByPatient ||
                  updatingMedicationByPatient
                }
              />
            )}
          </Block>
        </ScrollView>
      </FormikProvider>
    </KeyboardView>
  );
};

export default SearchMedicationScreen;
