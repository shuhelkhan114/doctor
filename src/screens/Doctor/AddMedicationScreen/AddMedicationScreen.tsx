import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import DropDown from '@components/DropDown/DropDown';
import ErrorText from '@components/ErrorText/ErrorText';
import Spinner from '@components/Loaders/Spinner';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import useDebounce from '@hooks/useDebounce';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import MedicationSearchItem from '@modules/Shared/AddMedication/MedicationSearchItem/MedicationSearchItem';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { PatientRowData } from '@typings/common';
import { Drug } from '@typings/drugbank';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type AddMedicationScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.AddMedicationScreen
>;

export type AddMedicationScreenParams = {
  patient: PatientRowData;
};

const AddMedicationScreen: React.FC<AddMedicationScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patient } = route.params;
  const [search, setSearch] = useState('');
  const [selectedMedication, setSelectedMedication] = useState<Drug | null>(null);
  const [frequency, setFrequency] = useState('');

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const frequencies = useAppSelector((state) => state.auth.config.medication_frequecny);

  const debouncedSearch = useDebounce(search, 500);

  const {
    isLoading: fetchingMedications,
    error: fetchingMedicationsError,
    data: medications,
  } = useQuery(
    ['drugBank/drug_names', debouncedSearch],
    () => API.drugbank.searchMedications(debouncedSearch),
    {
      enabled: !!debouncedSearch,
      onError: () => {
        toast.error('Unable to fetch medication, please try again!');
      },
    }
  );

  const {
    isLoading: addingMedication,
    error: addMedicationError,
    mutate: addMedication,
  } = useMutation(API.doctor.medication.addMedication, {
    onSuccess() {
      toast.success(`Medication added successfully`);
      dispatch(refetchDoctor());
      queryClient.refetchQueries(['doctor/patient', patient?.id]);
      navigation.goBack();
    },
    onError() {
      toast.error(`Unable to add medication, please try again!`);
    },
  });

  const handleAdd = () => {
    if (selectedMedication) {
      addMedication({
        patientId: patient?.id!,
        params: {
          name: selectedMedication.name,
          dosage: `${selectedMedication.strength.number} ${selectedMedication.strength.unit}`,
          drugbank_id: selectedMedication.ndc_product_codes?.[0],
          frequency,
          // price_range: '$',
        },
      });
    }
  };

  const handleClear = () => {
    setSelectedMedication(null);
    setSearch('');
  };

  let content: React.ReactNode = null;

  if (selectedMedication) {
    content = (
      <Block mT="xxl">
        <DropDown
          value={frequency}
          placeholder="Frequency"
          onSelect={(value) => setFrequency(value)}
          options={frequencies.map((freq) => ({
            label: freq.value,
            value: freq.value,
          }))}
        />
      </Block>
    );
  } else {
    let medicationContent: React.ReactNode = null;
    if (fetchingMedications) {
      medicationContent = <Spinner />;
    } else if (fetchingMedicationsError) {
      medicationContent = (
        <Typography variation="description2" color="negativeAction">
          Unable to fetch medications, Please try again!
        </Typography>
      );
    } else {
      medicationContent = medications?.map((medication, index) => {
        const handleMedicationPress = () => {
          Keyboard.dismiss();
          setSelectedMedication(medication);
        };

        return (
          <MedicationSearchItem
            status={medication.dosage_form}
            onPress={handleMedicationPress}
            key={medication.ndc_product_codes[0]}
            bottomBorder={medications?.length - 1 !== index}
            name={`${medication.name} (${medication.strength.number} ${medication.strength.unit})`}
          />
        );
      });
    }

    content = (
      <ScrollView mT="xxl" pH="lg">
        {medicationContent}
      </ScrollView>
    );
  }

  return (
    <Block flex1>
      <Block align="center" mT="xxl" mB="xxxl">
        <Block width={48} height={4} bgColor="lighter" rounded="6xl" />
      </Block>
      <Block pH="xxxl" pB="xxxl" flex1>
        <Typography variation="title2Bolder">Add Medication</Typography>
        <PatientRow
          mT="md"
          name={patient.name}
          imageUrl={patient.imageUrl}
          doctorsCount={patient.doctorsCount}
          healthIssuesCount={patient.healthIssuesCount}
        />
        <Search
          mT="xxl"
          onSearch={setSearch}
          onClear={handleClear}
          placeholder="Search for medication"
          value={selectedMedication?.name || search}
        />
        <Block mB="auto">
          {content}
          <ErrorText error={addMedicationError} />
        </Block>
        <Button
          icon="add"
          iconColor="white"
          onPress={handleAdd}
          title="Add Medication"
          loading={addingMedication}
          disabled={!selectedMedication || !frequency}
        />
      </Block>
    </Block>
  );
};

export default AddMedicationScreen;
