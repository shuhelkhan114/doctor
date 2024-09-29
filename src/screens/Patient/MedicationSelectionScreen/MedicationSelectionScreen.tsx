import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import Modal from '@components/Modal/Modal';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import useAppTheme from '@hooks/useTheme';
import MedicationConfirmation, {
  MedicationInfo,
} from '@modules/Patient/MedicationSelection/MedicationConfirmation/MedicationConfirmation';
import FHIROnboardingHeader from '@modules/Shared/FHIROnboardingHeader/FHIROnboardingHeader';
import MedicationRow from '@modules/Shared/MedicationSelectionItem/MedicationSelectionItem';
import { AuthStackScreens } from '@navigation/AuthStack';
import { fetchFHIRMedications, updateMedication } from '@store/slices/patientOnboardingSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { FHIRMedication } from '@typings/api-responses/fhir/medication';
import { useMutation } from 'react-query';

type MedicationSelectionScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.MedicationSelectionScreen
>;

export type MedicationSelectionScreenParams =
  | {
      isManualSignup?: boolean;
    }
  | undefined;

const MedicationSelectionScreen: React.FC<MedicationSelectionScreenProps> = (props) => {
  const { navigation, route } = props;
  const { isManualSignup = false } = route.params || {};

  const [selectedMedicine, setSelectedMedicine] = useState<FHIRMedication | null>(null);

  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const {
    mutateAsync: addMedication,
    isLoading,
    isError,
    error,
  } = useMutation(API.patient.medication.addMedication);
  const fhirMedicationsState = useAppSelector((state) => state.patientOnboarding.medications);
  const patientId = useAppSelector((state) => state.patientOnboarding.patientId);

  useEffect(() => {
    if (patientId && !isManualSignup) {
      dispatch(fetchFHIRMedications(patientId));
    }
  }, [patientId]);

  const handleContinue = async () => {
    try {
      const confirmedMedications = fhirMedicationsState.data.filter(
        (medication) => medication.status === 'confirmed'
      );
      if (confirmedMedications.length > 0) {
        await addMedication(
          confirmedMedications.map((medication) => ({
            name: medication.name,
            frequency: medication.frequency,
            price_range: medication?.priceRange,
            drugbank_id: medication?.drugBankId || medication.id,
            dosage: `${medication.dosageAmount.toString()} ${medication.dosageUnit}`,
          }))
        );
      }

      if (isManualSignup) {
        navigation.navigate(Screens.DoctorSelectionScreen, {
          isManualSignup,
        });
      } else {
        navigation.navigate(Screens.GaeaSearchingScreen, {
          title: 'Back to medications',
          nextScreen: 'DoctorSelectionScreen',
          description: 'Searching for your care team',
        });
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleClose = () => {
    setSelectedMedicine(null);
  };

  const handleConfirmMedication = (medicationInfo: MedicationInfo) => {
    if (selectedMedicine) {
      dispatch(
        updateMedication({
          id: selectedMedicine.id,
          status: 'confirmed',
          params: {
            frequency: medicationInfo.frequency,
            priceRange: medicationInfo.priceRange,
          },
        })
      );
      setSelectedMedicine(null);
    }
  };

  const handleCancelMedication = () => {
    if (selectedMedicine) {
      dispatch(updateMedication({ id: selectedMedicine.id, status: 'rejected' }));
      setSelectedMedicine(null);
    }
  };

  const navigateToAddMedication = () => {
    navigation.navigate(Screens.SearchMedicationScreen, { from: 'PATIENT', onboarding: true });
  };

  let content: React.ReactNode;

  if (fhirMedicationsState.fetching) {
    content = <ActivityIndicator color={theme.colors.mainBlue} />;
  } else if (fhirMedicationsState.error) {
    content = (
      <Block>
        <ErrorText error={{ message: 'Unable to fetch data from FHIR' }} />
      </Block>
    );
  } else if (fhirMedicationsState.data.length < 1) {
    content = (
      <Block align="center">
        <Image
          style={{ width: '50%' }}
          source={require('@assets/no-medications.png')}
          resizeMode="contain"
        />
        <Typography center variation="title3" mB="5xl">
          Click continue if you are don't have any medications, or add medication
        </Typography>
      </Block>
    );
  } else {
    content = fhirMedicationsState.data.map((medicine, index) => {
      const handleCheck = () => {
        setSelectedMedicine(medicine);
      };

      return (
        <MedicationRow
          bC="lightest"
          key={medicine.id}
          name={medicine.name!}
          onPress={handleCheck}
          status={medicine.status}
          dosageUnit={medicine.dosageUnit}
          dosageAmount={medicine.dosageAmount}
          bBW={index === fhirMedicationsState.data.length - 1 ? 0 : 1}
        />
      );
    });
  }

  const disabled =
    fhirMedicationsState.fetching ||
    (fhirMedicationsState.data?.length > 0
      ? fhirMedicationsState.data?.some((medicine) => medicine.status === 'undetermined')
      : false);

  return (
    <KeyboardView>
      <Modal disabledSwipe visible={!!selectedMedicine} onClose={handleClose}>
        {selectedMedicine && (
          <MedicationConfirmation
            closeModal={handleClose}
            medication={selectedMedicine}
            onConfirm={handleConfirmMedication}
            onCancel={handleCancelMedication}
          />
        )}
      </Modal>
      <FHIROnboardingHeader
        title={
          isManualSignup ? 'Please insert any medications you take' : 'I found these medications'
        }
      />
      <Block pH="xxxl" pV="xxxl" flex1>
        {isError && <ErrorText error={error} />}
        <Block mB="auto" flex1>
          <ScrollView>
            {content}
            <Button
              mT="xxxl"
              variation="secondary"
              title="Add medication"
              mB="xxl"
              onPress={navigateToAddMedication}
            />
          </ScrollView>
        </Block>
        <Button disabled={disabled} loading={isLoading} title="Continue" onPress={handleContinue} />
      </Block>
    </KeyboardView>
  );
};

export default MedicationSelectionScreen;
